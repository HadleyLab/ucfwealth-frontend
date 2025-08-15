import { Questionnaire, QuestionnaireItem, QuestionnaireResponse } from 'fhir/r4b';
import Markdown from 'react-markdown';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Spinner } from '@beda.software/emr/components';
import { usePatientDocumentPrint } from '@beda.software/emr/dist/containers/PatientDetails/DocumentPrint/hooks';
import {
    flattenQuestionnaireGroupItems,
    getQuestionnaireItemValue,
    qItemIsHidden,
} from '@beda.software/emr/dist/containers/PatientDetails/DocumentPrint/utils';
import { compileAsFirst, humanDate } from '@beda.software/emr/utils';
import { parseFHIRDate } from '@beda.software/fhir-react';

import logo from './images/logo.png';
import { S } from './styles';

const isMarkdown = compileAsFirst(
    "extension.where(url='http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl').valueCodeableConcept.coding.code = 'markdown'");

export function DocumentPrintAnswer(props: { item: QuestionnaireItem; qResponse?: QuestionnaireResponse }) {
    const { item, qResponse } = props;
    const itemValue = qResponse && getQuestionnaireItemValue(item, qResponse);

    if (qItemIsHidden(item)) {
        return null;
    }

    if (item.type === 'date') {
        return (
            <S.P key={item.linkId}>
                {item.text}
                {itemValue && `: ${parseFHIRDate(itemValue).format(humanDate)}`}
            </S.P>
        );
    }

    return (
        <S.P key={item.linkId}>
            {isMarkdown(item) ?
                <Markdown>{item.text}</Markdown> :
                item.text
            }
            {itemValue && `: ${itemValue}`}
        </S.P>
    );
}

export function DocumentPrintAnswers(props: {
    questionnaireResponse: QuestionnaireResponse;
    questionnaire: Questionnaire;
}) {
    const { questionnaire, questionnaireResponse } = props;
    const qrItems = questionnaire.item?.map((item) => {
        switch (item.type) {
            case 'display':
                return <DocumentPrintAnswer key={item.linkId} item={item} />;
            case 'group':
                return flattenQuestionnaireGroupItems(item)?.map((item) => {
                    return <DocumentPrintAnswer key={item.linkId} item={item} qResponse={questionnaireResponse} />;
                });
            default:
                return <DocumentPrintAnswer key={item.linkId} item={item} qResponse={questionnaireResponse} />;
        }
    });
    return qrItems;
}

export function DocumentPrint(props: { headerHeight?: string; footerHeight?: string; pageMargin?: string }) {
    const { headerHeight, footerHeight, pageMargin } = props;
    const { response } = usePatientDocumentPrint();

    return (
        <>
            <RenderRemoteData remoteData={response} renderLoading={Spinner}>
                {(bundle) => {
                    return (
                        <S.Container $pageMargin={pageMargin}>
                            <table>
                                <thead>
                                    <tr>
                                        <td>
                                            <S.HeaderSpace $headerHeight={headerHeight}>
                                                <img src={logo} />
                                            </S.HeaderSpace>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <S.Title>{bundle.questionnaire.title}</S.Title>
                                            <DocumentPrintAnswers {...bundle} />
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            <S.FooterSpace $footerHeight={footerHeight}>&nbsp;</S.FooterSpace>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </S.Container>
                    );
                }}
            </RenderRemoteData>
        </>
    );
}
