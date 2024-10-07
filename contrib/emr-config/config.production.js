const config = {
    clientId: 'web',

    wearablesAccessConsentCodingSystem: 'https://fhir.emr.beda.software/CodeSystem/consent-subject',

    tier: 'production',
    baseURL: 'https://aidbox.ucfwealth.app',
    
    sdcIdeUrl: null,
    aiQuestionnaireBuilderUrl: null,
    sdcBackendUrl: null,
    webSentryDSN: null,
    mobileSentryDSN: null,
    jitsiMeetServer: null,
    wearablesDataStreamService: 'https://ingest.emr.beda.software/api/v1',
    metriportIdentifierSystem: 'https://api.sandbox.metriport.com',
    aiAssistantServiceUrl: 'https://scribe.emr.beda.software',
};

export { config as default };
