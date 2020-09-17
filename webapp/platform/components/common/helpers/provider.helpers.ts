/*
 *  (c) 2018-2020 Cloudera, Inc. All rights reserved.
 *
 *    This code is provided to you pursuant to your written agreement with Cloudera, which may be the terms of the
 *   Affero General Public License version 3 (AGPLv3), or pursuant to a written agreement with a third party authorized
 *   to distribute this code.  If you do not have a written agreement with Cloudera or with an authorized and
 *   properly licensed third party, you do not have any rights to this code.
 *
 *    If this code is provided to you under the terms of the AGPLv3:
 *    (A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY KIND;
 *    (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT
 *        LIMITED TO IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;
 *    (C) CLOUDERA IS NOT LIABLE TO YOU, AND WILL NOT DEFEND, INDEMNIFY, OR HOLD YOU HARMLESS FOR ANY CLAIMS ARISING
 *        FROM OR RELATED TO THE CODE; AND
 *    (D) WITH RESPECT TO YOUR EXERCISE OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *        DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED
 *        TO, DAMAGES RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF BUSINESS ADVANTAGE OR
 *        UNAVAILABILITY, OR LOSS OR CORRUPTION OF DATA.
 *
 */

import * as _ from 'lodash';
import { CloudProvidersEnum } from '../shared/enums/cloud-providers.enum';

export interface ProviderForSelectType {
    name: string;
    imageUrl: string;
    iconUrl?: string;
    providerCode: CloudProvidersEnum;
    isGovCloud: boolean;
}

export class ProviderHelpers {
    static readonly providersForSelect: ProviderForSelectType[] = [
        {
            name: 'amazon',
            imageUrl: './platform/assets/images/provider-logos/transparent/aws.png',
            iconUrl: './platform/assets/images/provider-logos/service-aws@2x.png',
            providerCode: CloudProvidersEnum.AWS,
            isGovCloud: false
        },
        {
            name: 'amazon-gov',
            imageUrl: './platform/assets/images/provider-logos/transparent/aws_gov_color.png',
            iconUrl: './platform/assets/images/provider-logos/service-aws@2x.png',
            providerCode: CloudProvidersEnum.AWS,
            isGovCloud: true
        },
        {
            name: 'azure',
            imageUrl: './platform/assets/images/provider-logos/transparent/msa.png',
            iconUrl: './platform/assets/images/provider-logos/service-azure@2x.png',
            providerCode: CloudProvidersEnum.AZURE,
            isGovCloud: false
        },
        {
            name: 'gcp',
            imageUrl: './platform/assets/images/provider-logos/transparent/gcp.png',
            iconUrl: './platform/assets/images/provider-logos/service-google@2x.png',
            providerCode: CloudProvidersEnum.GCP,
            isGovCloud: false
        },
        {
            name: 'openstack',
            imageUrl: './platform/assets/images/provider-logos/transparent/openstack.png',
            providerCode: CloudProvidersEnum.OPENSTACK,
            isGovCloud: false
        },
        {
            name: 'yarn',
            imageUrl: './platform/assets/images/provider-logos/transparent/yarn.png',
            providerCode: CloudProvidersEnum.YARN,
            isGovCloud: false
        }
    ];

    static getProviderCodeFromProviderName(providerName: string): CloudProvidersEnum {
        switch (providerName) {
            case 'amazon': {
                return CloudProvidersEnum.AWS;
            }

            case 'azure': {
                return CloudProvidersEnum.AZURE;
            }

            case 'gcp': {
                return CloudProvidersEnum.GCP;
            }

            case 'openstack': {
                return CloudProvidersEnum.OPENSTACK;
            }

            case 'amazon-gov': {
                return CloudProvidersEnum.AWS;
            }

            case 'yarn': {
                return CloudProvidersEnum.YARN;
            }

            default: {
                return CloudProvidersEnum.UNKNOWN;
            }
        }
    }

    static getProviderNameForProviderCode(providerCode: CloudProvidersEnum): string {
        switch (providerCode) {
            case CloudProvidersEnum.AWS: {
                return 'amazon';
            }

            case CloudProvidersEnum.AZURE: {
                return 'azure';
            }

            case CloudProvidersEnum.GCP: {
                return 'gcp';
            }

            case CloudProvidersEnum.OPENSTACK: {
                return 'openstack';
            }

            case CloudProvidersEnum.YARN: {
                return 'yarn';
            }

            default: {
                return 'Unknown';
            }
        }
    }

    static getProviderTitleFromProviderName(providerName: string) {
        switch (providerName) {
            case 'amazon': {
                return 'Amazon Web Services';
            }

            case 'azure': {
                return 'Microsoft Azure';
            }

            case 'gcp': {
                return 'Google Cloud Platform';
            }

            case 'openstack': {
                return 'Openstack';
            }

            case 'amazon-gov': {
                return 'Amazon Web Services GovCloud';
            }

            case 'yarn': {
                return 'Yarn';
            }

            default: {
                return 'Unknown';
            }
        }
    }

    static getProviderImageUrl(providerCode: CloudProvidersEnum): string {
        const provider = this.providersForSelect.find(
            (p) => p.name === this.getProviderNameForProviderCode(providerCode)
        );
        const providerIcon = _.get(provider, 'iconUrl');

        if (providerIcon) {
            return providerIcon;
        }

        return _.get(provider, 'imageUrl');
    }

    static getProviderName(providerCode: CloudProvidersEnum): string {
        return ProviderHelpers.getProviderTitleFromProviderName(
            ProviderHelpers.getProviderNameForProviderCode(providerCode)
        );
    }
}
