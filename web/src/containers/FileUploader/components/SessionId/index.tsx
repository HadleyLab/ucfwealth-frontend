import { sharedPatientId } from "src/sharedState";

export const SessionId = () => {
    const sessionId = sharedPatientId.getSharedState().id;

    const copySessionId = () => {
        if (sessionId) {
            navigator.clipboard.writeText(sessionId);
        }
    };

    return (
        <div className="flex place-items-center place-content-center">
            <span className="px-2">SessionID: </span>
            <span>{sessionId}</span>
            <button
                className="py-2 px-4 mx-4 font-semibold rounded-full text-white buttonStyle"
                onClick={copySessionId}
            >
                Copy
            </button>
        </div>
    );
};
