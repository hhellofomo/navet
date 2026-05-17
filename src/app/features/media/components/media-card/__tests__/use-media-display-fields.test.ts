import { describe, expect, it } from 'vitest';
import { useMediaDisplayFields } from '../use-media-display-fields';

const baseParams = {
  entityName: 'Kitchen',
  initialTitle: 'Kitchen',
  initialArtist: '',
  nothingPlayingLabel: 'Nothing playing',
  nothingPlayingDescription: 'No media selected',
};

describe('useMediaDisplayFields', () => {
  it('includes changing media metadata in the artwork key for stable content ids', () => {
    const first = useMediaDisplayFields({
      ...baseParams,
      liveAttrs: {
        entity_picture: '/api/media_player_proxy/media_player.kitchen',
        media_content_id: 'spotify:context:playlist:daily-mix',
        media_title: 'First song',
        media_artist: 'First artist',
        media_album_name: 'First album',
      },
    });
    const second = useMediaDisplayFields({
      ...baseParams,
      liveAttrs: {
        entity_picture: '/api/media_player_proxy/media_player.kitchen',
        media_content_id: 'spotify:context:playlist:daily-mix',
        media_title: 'Second song',
        media_artist: 'Second artist',
        media_album_name: 'Second album',
      },
    });

    expect(first.liveArtworkKey).not.toBe(second.liveArtworkKey);
  });
});
