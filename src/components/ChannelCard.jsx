import { useState } from 'react';
import { Play, Tv } from 'lucide-react';

// Country flag URL from flagcdn.com
const getFlagUrl = (countryCode) => {
    if (!countryCode) return null;
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
};

const ChannelCard = ({ channel, onPlay, isPlaying, theme }) => {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [flagError, setFlagError] = useState(false);

    const hasLogo = channel.logo && !imageError;
    const flagUrl = getFlagUrl(channel.country);

    const t = theme || {
        bgCard: '#1e1e2a',
        bgCardHover: '#262636',
        bgTertiary: '#1c1c26',
        bgLogoArea: '#3a3a4a',
        accent: '#8b5cf6',
        accentGlow: 'rgba(139, 92, 246, 0.15)',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        textMuted: '#64748b',
        border: 'rgba(255, 255, 255, 0.06)',
        borderHover: 'rgba(139, 92, 246, 0.4)',
    };

    return (
        <div
            onClick={() => onPlay(channel)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'relative',
                background: isHovered ? t.bgCardHover : t.bgCard,
                borderRadius: '14px',
                border: `1px solid ${isPlaying ? t.accent : (isHovered ? t.borderHover : t.border)}`,
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                transform: isHovered ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered ? '0 12px 28px rgba(0, 0, 0, 0.25)' : 'none',
            }}
        >
            {/* Live Badge */}
            {isPlaying && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '6px',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: '#ef4444',
                    zIndex: 2,
                }}>
                    <span style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        animation: 'pulse 1.5s ease-in-out infinite',
                    }}></span>
                    LIVE
                </div>
            )}

            {/* Logo Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                height: '80px',
                borderRadius: '10px',
                background: t.bgLogoArea || t.bgTertiary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                overflow: 'hidden',
            }}>
                {hasLogo ? (
                    <>
                        <img
                            src={channel.logo}
                            alt={channel.name}
                            style={{
                                maxWidth: '90%',
                                maxHeight: '60px',
                                objectFit: 'contain',
                                transition: 'opacity 0.3s ease',
                                opacity: imageLoaded ? 1 : 0,
                            }}
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageError(true)}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                        />
                        {!imageLoaded && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Tv size={32} color={t.textMuted} />
                            </div>
                        )}
                    </>
                ) : (
                    <Tv size={32} color={t.textMuted} />
                )}

                {/* Play Button Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(2px)',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                    transition: 'all 0.2s ease',
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)',
                    }}>
                        <Play size={18} fill="white" color="white" style={{ marginLeft: 2 }} />
                    </div>
                </div>
            </div>

            {/* Channel Info */}
            <div style={{ minHeight: '52px' }}>
                <h3 style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: t.textPrimary,
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.3,
                }} title={channel.name}>
                    {channel.name}
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                }}>
                    {/* Country with Flag */}
                    {channel.country && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            background: t.bgTertiary,
                            borderRadius: '6px',
                            color: t.textSecondary,
                            fontWeight: 500,
                        }}>
                            {flagUrl && !flagError && (
                                <img
                                    src={flagUrl}
                                    alt={channel.country}
                                    style={{
                                        width: '16px',
                                        height: '12px',
                                        objectFit: 'cover',
                                        borderRadius: '2px',
                                    }}
                                    onError={() => setFlagError(true)}
                                    loading="lazy"
                                />
                            )}
                            <span>{channel.country}</span>
                        </div>
                    )}

                    {/* Category */}
                    {channel.categories?.[0] && (
                        <span style={{
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            background: t.accentGlow,
                            borderRadius: '6px',
                            color: t.accent,
                            fontWeight: 500,
                            textTransform: 'capitalize',
                        }}>
                            {channel.categories[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChannelCard;
