const Deal = require("../model/shared/deal");

const recordDeal = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const role = req.user.role;
        const { buyerId, partnerId, productName, price, costPrice, units, city, category } = req.body;

        const actualPartnerId = partnerId || buyerId;

        let finalSellerId, finalBuyerId;
        if (role === 'buyer') {
            finalBuyerId = userId;
            finalSellerId = actualPartnerId;
        } else {
            finalSellerId = userId;
            finalBuyerId = actualPartnerId;
        }

        const p = Number(price);
        const cp = Number(costPrice) || 0;
        const u = Number(units);

        const revenue = p * u;
        const profit = (p - cp) * u;

        const deal = new Deal({
            sellerId: finalSellerId,
            buyerId: finalBuyerId,
            productName,
            price: p,
            costPrice: cp,
            units: u,
            revenue,
            profit,
            city,
            category
        });

        await deal.save();

        res.status(201).json({ success: true, deal });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error recording deal", error: error.message });
    }
};

const getSellerAnalytics = async (req, res) => {
    try {
        const sellerId = req.user.id || req.user._id;
        const { timeframe = '1m', page = 1, limit = 10 } = req.query;

        // 1. Chart Data (Calculated from ALL deals for the fixed X-axis)
        const allDealsForChart = await Deal.find({ sellerId });

        const nowTime = new Date().getTime();
        const chartDataMap = {
            '1D': { date: '1D', revenue: 0, profit: 0, units: 0 },
            '5D': { date: '5D', revenue: 0, profit: 0, units: 0 },
            '10D': { date: '10D', revenue: 0, profit: 0, units: 0 },
            '1M': { date: '1M', revenue: 0, profit: 0, units: 0 },
            '3M': { date: '3M', revenue: 0, profit: 0, units: 0 },
            '1Y': { date: '1Y', revenue: 0, profit: 0, units: 0 },
        };
        const dayMs = 24 * 60 * 60 * 1000;

        allDealsForChart.forEach(deal => {
            const rev = deal.revenue || 0;
            const prof = deal.profit || 0;
            const diffDays = (nowTime - deal.createdAt.getTime()) / dayMs;

            if (diffDays <= 1) { chartDataMap['1D'].revenue += rev; chartDataMap['1D'].profit += prof; }
            if (diffDays <= 5) { chartDataMap['5D'].revenue += rev; chartDataMap['5D'].profit += prof; }
            if (diffDays <= 10) { chartDataMap['10D'].revenue += rev; chartDataMap['10D'].profit += prof; }
            if (diffDays <= 30) { chartDataMap['1M'].revenue += rev; chartDataMap['1M'].profit += prof; }
            if (diffDays <= 90) { chartDataMap['3M'].revenue += rev; chartDataMap['3M'].profit += prof; }
            if (diffDays <= 365) { chartDataMap['1Y'].revenue += rev; chartDataMap['1Y'].profit += prof; }
        });
        const chartData = Object.values(chartDataMap);

        // 2. Metrics & Table (Filtered by timeframe query)
        const now = new Date();
        let startDate = new Date();
        if (timeframe === '1d') startDate.setDate(now.getDate() - 1);
        else if (timeframe === '5d') startDate.setDate(now.getDate() - 5);
        else if (timeframe === '10d') startDate.setDate(now.getDate() - 10);
        else if (timeframe === '1m') startDate.setMonth(now.getMonth() - 1);
        else if (timeframe === '3m') startDate.setMonth(now.getMonth() - 3);
        else if (timeframe === '1y') startDate.setFullYear(now.getFullYear() - 1);
        else startDate.setMonth(now.getMonth() - 1); // default 1m

        const query = { sellerId, createdAt: { $gte: startDate } };
        const timeframeDeals = await Deal.find(query);

        let totalUnits = 0;
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalLoss = 0;

        timeframeDeals.forEach(deal => {
            totalUnits += (deal.units || 0);
            totalRevenue += (deal.revenue || 0);
            const prof = deal.profit || 0;
            if (prof >= 0) {
                totalProfit += prof;
            } else {
                totalLoss += Math.abs(prof);
            }
        });

        // Pagination for table (returning latest first)
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedDeals = await Deal.find(query)
            .populate('buyerId', 'username profession city')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const totalCount = await Deal.countDocuments(query);

        res.status(200).json({
            success: true,
            metrics: { totalUnits, totalRevenue, totalProfit, totalLoss },
            chartData,
            table: {
                deals: paginatedDeals,
                total: totalCount,
                page: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit))
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching analytics", error: error.message });
    }
};

const getBuyerAnalytics = async (req, res) => {
    try {
        const buyerId = req.user.id || req.user._id;
        const { timeframe = '1m', page = 1, limit = 10 } = req.query;

        const allDealsForChart = await Deal.find({ buyerId });

        const nowTime = new Date().getTime();
        const chartDataMap = {
            '1D': { date: '1D', spent: 0, units: 0 },
            '5D': { date: '5D', spent: 0, units: 0 },
            '10D': { date: '10D', spent: 0, units: 0 },
            '1M': { date: '1M', spent: 0, units: 0 },
            '3M': { date: '3M', spent: 0, units: 0 },
            '1Y': { date: '1Y', spent: 0, units: 0 },
        };
        const dayMs = 24 * 60 * 60 * 1000;

        allDealsForChart.forEach(deal => {
            const spent = deal.price * deal.units || 0;
            const un = deal.units || 0;
            const diffDays = (nowTime - deal.createdAt.getTime()) / dayMs;

            if (diffDays <= 1) { chartDataMap['1D'].spent += spent; chartDataMap['1D'].units += un; }
            if (diffDays <= 5) { chartDataMap['5D'].spent += spent; chartDataMap['5D'].units += un; }
            if (diffDays <= 10) { chartDataMap['10D'].spent += spent; chartDataMap['10D'].units += un; }
            if (diffDays <= 30) { chartDataMap['1M'].spent += spent; chartDataMap['1M'].units += un; }
            if (diffDays <= 90) { chartDataMap['3M'].spent += spent; chartDataMap['3M'].units += un; }
            if (diffDays <= 365) { chartDataMap['1Y'].spent += spent; chartDataMap['1Y'].units += un; }
        });
        const chartData = Object.values(chartDataMap);

        const now = new Date();
        let startDate = new Date();
        if (timeframe === '1d') startDate.setDate(now.getDate() - 1);
        else if (timeframe === '5d') startDate.setDate(now.getDate() - 5);
        else if (timeframe === '10d') startDate.setDate(now.getDate() - 10);
        else if (timeframe === '1m') startDate.setMonth(now.getMonth() - 1);
        else if (timeframe === '3m') startDate.setMonth(now.getMonth() - 3);
        else if (timeframe === '1y') startDate.setFullYear(now.getFullYear() - 1);
        else startDate.setMonth(now.getMonth() - 1);

        const query = { buyerId, createdAt: { $gte: startDate } };
        const timeframeDeals = await Deal.find(query);

        let totalUnits = 0;
        let totalSpent = 0;

        timeframeDeals.forEach(deal => {
            totalUnits += (deal.units || 0);
            totalSpent += (deal.price * deal.units || 0);
        });

        const skip = (Number(page) - 1) * Number(limit);
        const paginatedDeals = await Deal.find(query)
            .populate('sellerId', 'username profession city')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const totalCount = await Deal.countDocuments(query);

        res.status(200).json({
            success: true,
            metrics: { totalUnits, totalSpent },
            chartData,
            table: {
                deals: paginatedDeals,
                total: totalCount,
                page: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit))
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching buyer analytics", error: error.message });
    }
};

module.exports = { recordDeal, getSellerAnalytics, getBuyerAnalytics };
