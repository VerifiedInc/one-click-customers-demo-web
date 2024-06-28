import { logger } from '~/logger.server';
import { getDBOneClick, getSharedCredentialsOneClick } from '~/coreAPI.server';
import { getBrandSet } from '~/utils/getBrandSet';
import { config } from '~/config';

export async function getOneClickUseCase({ request }: { request: Request }) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const brandSet = await getBrandSet(searchParams);

  const oneClickUuid = searchParams.get('1ClickUuid');
  const optedOut = url.searchParams.get('optedOut');

  logger.info(`optedOut value ${optedOut}`);

  // if the oneClickUuid is present and the user has not opted out
  if (oneClickUuid && optedOut !== 'true') {
    logger.info('1click uuid value found and opted out is not true');
    const oneClick = await getSharedCredentialsOneClick(oneClickUuid, {
      baseUrl: config.coreServiceUrl,
      apiKey: brandSet.apiKey,
    });
    const oneClickDB = await getDBOneClick(oneClickUuid, {
      baseUrl: config.coreServiceUrl,
      adminKey: config.coreServiceAdminAuthKey,
    });

    if (oneClick && oneClickDB) {
      return { success: { oneClick, oneClickDB } };
    }

    logger.error('OneClick not found', { oneClickUuid });

    return { failure: new Error('OneClick not found') };
  }
}
