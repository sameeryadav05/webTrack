import geopip from 'geoip-lite'


const getLocation = (ip)=>{
    const geo = geopip.lookup(ip);

    if(!geo)
    {
        return {
            country:'UnKnown',
            city:'UnKnown'
        }
    }


    return {
        country:geo.country || 'UnKnown' ,
        city:geo.city || 'UnKnown'
    }
}

export default getLocation;