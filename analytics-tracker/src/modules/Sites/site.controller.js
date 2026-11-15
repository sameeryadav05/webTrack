
import crypto from "node:crypto";

import Site from "./site.model.js";


/*
  CREATE SITE
*/

export const createSite = async (req, res) => {

    try {

        const { siteName, domain } = req.body;


        // 1. VALIDATE INPUT

        if (!siteName || !siteName.trim()) {
            return res.status(400).json({
                success: false,
                message: "Site name is required"
            });
        }

        if (!domain || !domain.trim()) {
            return res.status(400).json({
                success: false,
                message: "Domain is required"
            });
        }


        // 2. NORMALIZE AND VALIDATE DOMAIN

        let cleanDomain;

        try {

            const rawDomain = domain.trim();

            // Automatically add HTTPS if protocol is missing
            const formattedDomain = /^https?:\/\//i.test(rawDomain)
                ? rawDomain
                : `https://${rawDomain}`;

            const parsedUrl = new URL(formattedDomain);

            // Allow only HTTP and HTTPS
            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                throw new Error("Invalid protocol");
            }

            // Reject paths, query parameters and fragments
            if (
                parsedUrl.pathname !== "/" ||
                parsedUrl.search ||
                parsedUrl.hash ||
                parsedUrl.username ||
                parsedUrl.password
            ) {
                throw new Error("Invalid domain format");
            }

            // Normalize domain
            cleanDomain = parsedUrl.origin.toLowerCase();

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: "Invalid domain URL. Enter a valid domain such as example.com"
            });

        }


        // 3. CHECK EXISTING SITE

        const existingSite = await Site.findOne({
            domain: cleanDomain
        });

        if (existingSite) {

            return res.status(400).json({
                success: false,
                message: "This domain is already registered"
            });

        }


        // 4. GENERATE UNIQUE CREDENTIALS

        const siteId = `site_${crypto.randomUUID()}`;

        const apiKey = `key_${crypto.randomUUID()}`;


        // 5. CREATE SITE

        const newSite = await Site.create({

            user: req.user._id,

            siteName: siteName.trim(),

            domain: cleanDomain,

            siteId,

            apiKey

        });


        // 6. GENERATE TRACKING SCRIPT

        const script = `
<script
    src="https://webtrack-ox8a.onrender.com/tracker.js"
    data-site-id="${newSite.siteId}"
    data-api-key="${newSite.apiKey}"
></script>
`;


        // 7. SEND RESPONSE

        return res.status(201).json({

            success: true,

            message: "Site created successfully",

            site: newSite,

            script

        });


    } catch (error) {

        console.error("Create Site Error:", error);


        // Handle MongoDB duplicate key error

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message: "This domain is already registered"

            });

        }


        return res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }

};



/*
  GET MY SITES
*/

export const getMySites = async (req, res) => {

    try {

        // Find sites belonging to authenticated user

        const sites = await Site.find({

            user: req.user._id

        }).sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            count: sites.length,

            sites

        });


    } catch (error) {

        console.error("Get My Sites Error:", error);


        return res.status(500).json({

            success: false,

            message: "Failed to fetch sites"

        });

    }

};
