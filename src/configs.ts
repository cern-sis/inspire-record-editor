
const ALL_KEYS = [
    "$schema",
    "_bucket",
    "_collections", //
    "_desy_bookkeeping", //
    "_export_to",
    "_files", //
    "_private_notes",
    "abstracts",
    "accelerator_experiments",
    "acquisition_source",
    "arxiv_eprints", //
    "authors",
    "book_series", //
    "citeable",
    "collaborations",
    "control_number",
    "copyright",
    "core",
    "corporate_author", //
    "curated",
    "data", //
    "deleted",
    "deleted_records", //
    "document_type",
    "documents",
    "dois",
    "editions", //
    "energy_ranges", //
    "external_system_identifiers", //
    "figures", //
    "funding_info", //
    "imprints",
    "inspire_categories",
    "isbns", //
    "keywords",
    "languages", //
    "legacy_creation_date", //
    "legacy_version", //
    "license",
    "new_record", //
    "number_of_pages",
    "persistent_identifiers", //
    "preprint_date",
    "public_notes",
    "publication_info",
    "publication_type", //
    "record_affiliations", //
    "refereed",
    "references",
    "related_records", //
    "report_numbers",
    "rpp", //
    "self",
    "texkeys",
    "thesis_info", //
    "title_translations", //
    "titles",
    "urls",
    "withdrawn",
]


const MAIN_TAB = [
    "_collections", //
    "_export_to", //
    "_private_notes", //
    "abstracts", //
    "acquisition_source", //
    "citeable",
    "control_number",
    "copyright", //
    "core",
    "curated",
    "deleted",
    "document_type", //
    "documents", //
    "dois", // 
    "imprints", //
    "inspire_categories", //
    "keywords", //
    "license", //
    "number_of_pages", //
    // "persistent_identifiers",
    "preprint_date", //
    "public_notes", //
    "publication_info", //
    "report_numbers", //
    "refereed",
    "texkeys", //
    "titles", //
    "urls", //
    "withdrawn",
]


const ADMIN_MAIN_TAB = [
    "$schema",
    "_bucket",
    "_desy_bookkeeping",
    "_files",
    "accelerator_experiments",
    "arxiv_eprints",
    "book_series",
    "citeable",
    "control_number",
    "core",
    "corporate_author",
    "curated",
    "data",
    "deleted",
    "deleted_records",
    "editions",
    "energy_ranges",
    "external_system_identifiers",
    "figures",
    "funding_info",
    "isbns",
    "languages",
    "legacy_creation_date",
    "legacy_version",
    "new_record",
    "persistent_identifiers",
    "publication_type",
    "record_affiliations",
    "refereed",
    "related_records",
    "rpp",
    "self",
    "thesis_info",
    "title_translations",
    "withdrawn",
]


const AUTHORS_TAB = [
    "collaborations",
    "accelerator_experiments",
    "authors",
]

const REFS_TAB = [
    "references",
]

export const TAB_KEYS = {
    all: ALL_KEYS,
    main: MAIN_TAB,
    main_admin: ADMIN_MAIN_TAB,
    refs: REFS_TAB,
    authors: AUTHORS_TAB,
}