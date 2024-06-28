export const jwtUtils = {
  decode<D>(jwt: string): D {
    const jwtParts = jwt.split('.');

    if (jwtParts.length !== 3) {
      throw new Error('Invalid JWT');
    }

    return JSON.parse(
      Buffer.from(jwtParts[1], 'base64').toString('utf-8')
    ) as D;
  },
};
