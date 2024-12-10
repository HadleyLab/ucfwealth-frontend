import { expandHealthSamuraiValueSet } from '@beda.software/emr/services';
import { isSuccess } from '@beda.software/remote-data';


export async function expandValueSet(answerValueSet: string | undefined, searchText: string) {
    if (answerValueSet) {
        const response = await expandHealthSamuraiValueSet(answerValueSet, searchText);
        if (isSuccess(response)){
            return response.data;
        }
    }
    return [];
}
