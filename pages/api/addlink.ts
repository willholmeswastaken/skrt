import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../db";
import { isValidHttpUrl } from "../../utilities/urlhelper";

interface IAddLinkResponse {
  validUrl: boolean;
  link: string;
}

const AddLink = async (req: NextApiRequest, res: NextApiResponse<IAddLinkResponse>) => {
  const { url }: { url: string } = req.body;
  if (url === "" || url === undefined || url === null || !isValidHttpUrl(url))
    return res.status(422).json({ validUrl: false, link: '' });
  try {
    const linkId = Math.random().toString(36).substring(2, 8);
    await prisma.link.create({
      data: {
        url: url.toLowerCase(),
        linkId: linkId,
        visitCount: 0
      },
    });
    return res.status(200).json({ validUrl: true, link: linkId });
  } catch (ex) {
    console.log(ex);
    return res.status(500).send({ validUrl: true, link: '' });
  }
};

export default AddLink;
