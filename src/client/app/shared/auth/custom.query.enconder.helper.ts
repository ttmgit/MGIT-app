/*
 * CustomQueryEncoderHelper
 * Fix plus sign (+) not encoding, so sent as blank space
 * See: https://github.com/angular/angular/issues/11058#issuecomment-247367318
 */
import { QueryEncoder } from '@angular/http';

export class CustomQueryEncoderHelper extends QueryEncoder {
    encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    encodeValue(v: string): string {
        v = super.encodeValue(v);
        return v.replace(/\+/gi, '%2B');
    }
}
