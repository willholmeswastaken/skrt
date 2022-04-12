import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db";

const SearchLink = async (req: NextApiRequest, res: NextApiResponse) => {
    const linkId: string = req?.query['linkId'].toString() ?? '';
    if(!linkId) return res.status(400).send('');
    var link = await prisma?.link.findUnique({
        where: {
            linkId: linkId
        }
    });
    if(!link) return res.status(404).send('');
    return res.status(200).send('');
}

export default SearchLink;