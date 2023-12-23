const handler = (req: any, res: any) => {
  res.status(200).json({ message: "Hello API!" });
};

export default handler;
