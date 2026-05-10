import Tracking from '../Tracking/Tracking.model.js'
import {getRedisClient} from '../../config/redis.js'

export const getOverview = async (req,res)=>  // give totalPageViews ,unique visitors , avg duration
{
    try {
        const {siteId }= req.params;

        const TotalPageViews = await Tracking.countDocuments(
            {
                siteId,
                eventType:'pageview'
            }
        );

        const UniqueVisitors = await Tracking.distinct('visitorId',{siteId});

        const durationResult  = await Tracking.aggregate([
            {
                $match:{
                    siteId,
                    eventType:'page_exit'
                },
            },
            {
                $group:{
                    _id:null,
                    avgDuration:{
                        $avg:"$duration",
                    }
                }
            }
        ])

        const avgDuration = durationResult[0]?.avgDuration || 0;

        res.status(200).json({
            success: true,
            analytics: {
                totalPageviews: TotalPageViews,
                uniqueVisitors: UniqueVisitors.length,
                avgDuration: Math.floor(avgDuration / 1000),
            },
        });
        
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something Went Wrong !"
        })
    }
}

export const getActiveVisitors = async (req, res) => {

    try {

      const { siteId } =
        req.params;

      const redis =
        getRedisClient();



      const key =
        `site:${siteId}:active_visitors`;



      const activeVisitors =
        await redis.sCard(key);

      res.status(200).json({
        success: true,

        activeVisitors,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
};


export const getBrowsers  = async (req,res)=>
{
    try {
        const {siteId} = req.params;

      const browsers =
        await Tracking.aggregate([
          {
            $match: {
              siteId,
            },
          },

          {
            $group: {
              _id: "$browser",

              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
            },
          },
        ]);

    res.status(200).json({
        success: true,

        browsers,
      });
        
    } 
    catch (error) {

    console.log(error);
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
        
    }
}

export const getCountries =
  async (req, res) => {

    try {

      const { siteId } =
        req.params;

      const countries =
        await Tracking.aggregate([
          {
            $match: {
              siteId,
            },
          },

          {
            $group: {
              _id: "$country",

              count: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              count: -1,
            },
          },
        ]);

      res.status(200).json({
        success: true,

        countries,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
};

export const getTopPages =
  async (req, res) => {

    try {

      const { siteId } =
        req.params;

      const pages =
        await Tracking.aggregate([
          {
            $match: {
              siteId,

              eventType:
                "pageview",
            },
          },

          {
            $group: {
              _id: "$url",

              views: {
                $sum: 1,
              },
            },
          },

          {
            $sort: {
              views: -1,
            },
          },

          {
            $limit: 10,
          },
        ]);

      res.status(200).json({
        success: true,

        pages,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
};

