import { defineTransformer } from '@nuxt/content'
import path from 'path';
import crypto from 'crypto';

function updateImageSrc(json: any): any {
    if (Array.isArray(json)) {
        return json.map(updateImageSrc);
    } else if (typeof json === "object" && json !== null) {
        for (const key in json) {
            if (key === "src" && typeof json[key] === "string" && json[key].startsWith("./")) {
                const fileName = path.basename(json[key]);
                const fileBuffer = Buffer.from(fileName);

                const hash = crypto.createHash('sha256');
                hash.update(fileBuffer);
                const fileHash = hash.digest('hex');

                const newFileName = `${fileHash}${path.extname(fileName)}`;
                json[key] = `/local_references/${newFileName}`;
            } else {
                json[key] = updateImageSrc(json[key]);
            }
        }
    }
    return json;
}

export default defineTransformer({
    name: 'override-reference',
    extensions: ['.md'],
    transform(file) {
        return {
            ...file,
            body: updateImageSrc(file.body)
        }
    },
})
