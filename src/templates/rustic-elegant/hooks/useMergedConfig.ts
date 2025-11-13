// src/templates/modern-minimalist/hooks/useMergedConfig.ts
import { useMemo } from 'react';
import { WeddingConfig } from './useWeddingConfig';
import { UserInvitationConfig } from '../../../lib/supabase';

/**
 * Hook untuk merge konfigurasi default template dengan konfigurasi user
 * Priority: User Config > Default Template Config
 */
export const useMergedConfig = (
  defaultConfig: WeddingConfig,
  userConfig: UserInvitationConfig | null | undefined
): WeddingConfig => {
  return useMemo(() => {
    if (!userConfig) {
      return defaultConfig;
    }

    // Deep merge configuration
    return {
      ...defaultConfig,
      
      // Merge Couple Information
      couple: {
        bride: {
          ...defaultConfig.couple.bride,
          name: userConfig.bride_name || defaultConfig.couple.bride.name,
          fullName: userConfig.bride_full_name || defaultConfig.couple.bride.fullName,
          parents: userConfig.bride_parents || defaultConfig.couple.bride.parents,
          instagram: userConfig.bride_instagram || defaultConfig.couple.bride.instagram,
          email: userConfig.bride_email || defaultConfig.couple.bride.email,
          bio: userConfig.bride_bio || defaultConfig.couple.bride.bio,
          image: userConfig.bride_image_url || defaultConfig.couple.bride.image,
        },
        groom: {
          ...defaultConfig.couple.groom,
          name: userConfig.groom_name || defaultConfig.couple.groom.name,
          fullName: userConfig.groom_full_name || defaultConfig.couple.groom.fullName,
          parents: userConfig.groom_parents || defaultConfig.couple.groom.parents,
          instagram: userConfig.groom_instagram || defaultConfig.couple.groom.instagram,
          email: userConfig.groom_email || defaultConfig.couple.groom.email,
          bio: userConfig.groom_bio || defaultConfig.couple.groom.bio,
          image: userConfig.groom_image_url || defaultConfig.couple.groom.image,
        },
      },
      
      // Merge Wedding Information
      wedding: {
        ...defaultConfig.wedding,
        date: userConfig.wedding_date || defaultConfig.wedding.date,
        dateDisplay: userConfig.wedding_date_display || defaultConfig.wedding.dateDisplay,
        time: userConfig.wedding_time || defaultConfig.wedding.time,
      },
      
      // Merge Hero Section
      hero: {
        ...defaultConfig.hero,
        backgroundImage: userConfig.hero_background_image_url || defaultConfig.hero.backgroundImage,
        tagline: userConfig.hero_tagline || defaultConfig.hero.tagline,
      },
      
      // Merge Invitation Modal
      invitation: {
        ...defaultConfig.invitation,
        title: userConfig.invitation_title || defaultConfig.invitation.title,
        subtitle: userConfig.invitation_subtitle || defaultConfig.invitation.subtitle,
        buttonText: userConfig.invitation_button_text || defaultConfig.invitation.buttonText,
        backgroundVideo: userConfig.invitation_background_video_url || defaultConfig.invitation.backgroundVideo,
      },
      
      // Merge Cinematic
      cinematic: {
        ...defaultConfig.cinematic,
        videoSrc: userConfig.cinematic_video_url || defaultConfig.cinematic.videoSrc,
        doorImage: userConfig.cinematic_door_image_url || defaultConfig.cinematic.doorImage,
      },
      
      // Merge Music
      music: {
        ...defaultConfig.music,
        audioSrc: userConfig.music_audio_url || defaultConfig.music.audioSrc,
        lyrics: userConfig.music_lyrics || defaultConfig.music.lyrics,
      },
      
      // Merge Events (if user provided custom events)
      events: userConfig.events && userConfig.events.length > 0 
        ? userConfig.events 
        : defaultConfig.events,
      
      // Merge Story (if user provided custom story)
      story: userConfig.story && userConfig.story.length > 0 
        ? userConfig.story 
        : defaultConfig.story,
      
      // Merge Gallery (if user provided custom gallery)
      gallery: userConfig.gallery && userConfig.gallery.length > 0 
        ? userConfig.gallery 
        : defaultConfig.gallery,
      
      // Merge Donations (if user provided custom donations)
      donations: userConfig.donations && userConfig.donations.length > 0 
        ? userConfig.donations 
        : defaultConfig.donations,
      
      // Merge Prayer Letter
      prayerLetter: {
        greeting: userConfig.prayer_greeting || defaultConfig.prayerLetter.greeting,
        body1: userConfig.prayer_body1 || defaultConfig.prayerLetter.body1,
        body2: userConfig.prayer_body2 || defaultConfig.prayerLetter.body2,
        body3: userConfig.prayer_body3 || defaultConfig.prayerLetter.body3,
        closing: userConfig.prayer_closing || defaultConfig.prayerLetter.closing,
      },
      
      // Merge Theme Colors
      theme: {
        primary: userConfig.theme_primary || defaultConfig.theme?.primary || '#f43f5e',
        secondary: userConfig.theme_secondary || defaultConfig.theme?.secondary || '#f97316',
        accent: userConfig.theme_accent || defaultConfig.theme?.accent || '#ec4899',
      },
    };
  }, [defaultConfig, userConfig]);
};