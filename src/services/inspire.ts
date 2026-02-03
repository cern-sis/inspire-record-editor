import hepSchema from "../data/hep.json";
import exampleRecord from "../data/record_resp_example.json";

export const INSPIRE_EDITOR_BASE = 'https://inspirehep.net/api/editor/literature/';
export const INSPIRE_HEP_SCHEMA_URL = 'https://inspirehep.net/schemas/records/hep.json';


export async function fetchInspireRecord(id: string) {
    const res = await fetch(INSPIRE_EDITOR_BASE + encodeURIComponent(id), {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) return exampleRecord;
    // if (!res.ok) throw new Error(`Record fetch failed: ${res.status} ${res.statusText}`);
    return res.json();
}

export async function fetchHepSchema() {
    const res = await fetch(INSPIRE_HEP_SCHEMA_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return hepSchema
    // if (!res.ok) throw new Error(`Schema fetch failed: ${res.status} ${res.statusText}`);
    return res.json();
}
