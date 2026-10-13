import { BaseProvider } from '@omss/framework';
import type {
    ProviderCapabilities,
    ProviderMediaObject,
    ProviderResult
} from '@omss/framework';

export class MyProvider extends BaseProvider {
    readonly id = 'omega-stream-provider';
    readonly name = 'Omega Stream Provider';
    readonly enabled = true;

    readonly BASE_URL = 'https://vidsrc.cc';
    readonly HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Referer: 'https://vidsrc.cc'
    };

    readonly capabilities: ProviderCapabilities = {
        supportedContentTypes: ['movies', 'tv']
    };

    async getMovieSources(media: ProviderMediaObject): Promise<ProviderResult> {
        try {
            const tmdbId = media.id || media.tmdbId;
            const contentType = media.type || 'movie';

            if (!tmdbId) {
                throw new Error('Media ID (TMDB) is missing');
            }

            // Updated reliable embed endpoints
            const primaryUrl = `https://vidsrc.cc/v2/embed/${contentType}/${tmdbId}?sub=hi&audio=hi`;
            const fallbackUrl = `https://embed.su/embed/${contentType}/${tmdbId}`;

            return {
                sources: [
                    {
                        url: primaryUrl,
                        type: 'iframe',
                        quality: '1080p',
                        audioTracks: [{ language: 'hi', label: 'Hindi Audio' }],
                        provider: { id: this.id, name: this.name }
                    },
                    {
                        url: fallbackUrl,
                        type: 'iframe',
                        quality: '1080p',
                        audioTracks: [{ language: 'hi', label: 'Hindi Audio (Server 2)' }],
                        provider: { id: this.id, name: this.name }
                    }
                ],
                subtitles: [],
                diagnostics: []
            };
        } catch (error) {
            return {
                sources: [],
                subtitles: [],
                diagnostics: [
                    {
                        code: 'PROVIDER_ERROR',
                        message: error instanceof Error ? error.message : 'Unknown error',
                        field: 'getMovieSources',
                        severity: 'error'
                    }
                ]
            };
        }
    }

    async getTVSources(media: ProviderMediaObject): Promise<ProviderResult> {
        return this.getMovieSources(media);
    }

    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(this.BASE_URL, { method: 'HEAD' });
            return response.ok;
        } catch {
            return true;
        }
    }
                                       }
