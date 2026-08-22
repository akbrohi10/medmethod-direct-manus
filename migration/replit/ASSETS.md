# Public Asset Migration

The application currently references public marketing assets through `/manus-storage/...`. Those files are served by a Manus-specific storage proxy and are **not** contained in the GitHub repository.

The companion archive `medmethod-public-assets.zip` contains locally downloaded copies of the public assets referenced by the source code. It intentionally excludes database records, credentials, private uploads, logs, and any patient-submitted files.

For Replit, upload the files to a production object-storage service or copy them into a public static directory only if the resulting repository and deployment size remain acceptable. Then replace each `/manus-storage/<filename>` source reference with the new object-storage URL or local public path. Use `public-assets/asset-manifest.tsv` as the mapping source.

Do not rely indefinitely on the existing `/manus-storage/...` URLs after leaving Manus; the Replit server cannot reproduce the current signing proxy without Manus-specific Forge credentials.
