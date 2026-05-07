import {v4 as uuidv4  } from 'uuid'
import Site from './site.model.js'

export const createSite  = async (req,res)=>{
    try {
        const {siteName, domain} = req.body
        const newSite = await Site.create({
            siteName,
            domain,
            siteId:`site_${uuidv4()}`,
            apiKey:`key_${uuidv4()}`
        })

        res.status(201).json({
            success:true,
            site:newSite
        })
    }
     catch (error) {
        
            res.status(500).json({
                success: false,
                message: error.message,
            });
    }
}