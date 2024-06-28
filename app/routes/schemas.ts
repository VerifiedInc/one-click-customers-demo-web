import { ActionFunction, json } from '@remix-run/node';

import { getErrorMessage } from '~/errors';
import { logger } from '~/logger.server';
import { getSchemas } from '~/coreAPI.server';

export const path = () => '/schemas';

export const loader: ActionFunction = async () => {
  try {
    const schemas = await getSchemas();

    return json({ data: schemas });
  } catch (error) {
    logger.error(`Error getting custom demo state: ${getErrorMessage(error)}`);

    return json({ error: getErrorMessage(error) }, { status: 404 });
  }
};
