import { useCallback } from 'react';
import {
  CredentialDto,
  CredentialRequestDto,
  CredentialSchemaDto,
} from '@verifiedinc/core-types';

import { CredentialDisplayInfo } from '~/features/request/CredentialsDisplay/types';
import { useCredentialsDisplay } from '~/features/request/CredentialsDisplay/CredentialsDisplayContext';
import { CredentialsDisplayItem } from '~/features/request/CredentialsDisplay/CredentialsDisplayItem';
import { DataFieldStack } from '~/features/request/DataField/DataFieldStack';
import { DataFieldComposite } from '~/features/request/DataField/DataFieldComposite';
import { DataFieldAtomic } from '~/features/request/DataField/DataFieldAtomic';

export interface CredentialsDisplayProps {
  credentialRequests?: CredentialRequestDto[];
  credentials: CredentialDto[];
  receiverName?: string;
  schema: CredentialSchemaDto;
}

/**
 * Displays a list of credentials
 * i.e. for the Card Details or Request page
 */
export default function CredentialsDisplay() {
  const { receiverName, credentialRequests, displayInfoList } =
    useCredentialsDisplay();

  // if there are credential requests that means we're on the request page, so the credentials should be selectable
  const isSelectable = Boolean(credentialRequests);

  const renderCredentialDisplayInfo = useCallback(
    (
      credentialDisplayInfo: CredentialDisplayInfo,
      index: number,
      parents: number[],
      parentCredentialDisplayInfo?: CredentialDisplayInfo
    ): JSX.Element => {
      const parentsPath = parents.map((p) => `[${p}]`).join('');
      const path = `${parentsPath}[${index}]`;
      const isRoot = parents.length === 0;
      const providerProps = {
        credentialDisplayInfo,
        parentCredentialDisplayInfo,
        path,
        isSelectable,
        isRoot,
      };

      // For credential display with children, we build the parent and recursive render the nodes.
      if (Array.isArray(credentialDisplayInfo.children)) {
        return (
          <CredentialsDisplayItem
            key={credentialDisplayInfo.id}
            props={{
              sx: {
                // Decrease bottom spacing for the composed credentials.
                '& > span > div:first-of-type:has(> div:last-child)': {
                  marginBottom: 0,
                },
              },
            }}
            providerProps={providerProps}
          >
            <DataFieldComposite>
              <DataFieldStack spacing={2}>
                {credentialDisplayInfo.children.map((child, childIndex) =>
                  renderCredentialDisplayInfo(
                    child,
                    childIndex,
                    [...parents, index],
                    credentialDisplayInfo
                  )
                )}
              </DataFieldStack>
            </DataFieldComposite>
          </CredentialsDisplayItem>
        );
      }

      return (
        <CredentialsDisplayItem
          key={credentialDisplayInfo.id}
          providerProps={providerProps}
        >
          <DataFieldAtomic />
        </CredentialsDisplayItem>
      );
    },
    [displayInfoList, isSelectable, receiverName]
  );

  return (
    <DataFieldStack>
      {displayInfoList.map((credentialDisplayInfo, index: number) =>
        renderCredentialDisplayInfo(credentialDisplayInfo, index, [])
      )}
    </DataFieldStack>
  );
}
