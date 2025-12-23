import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { X, Loader, AlertCircle, Volume2, VolumeX, Shield, ShieldOff } from 'lucide-react';

// Local proxy server URL
const LOCAL_PROXY = 'http://localhost:3001/proxy?url=';

const VideoPlayer = ({ url, channelName, onClose, theme }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [useProxy, setUseProxy] = useState(false);
    const [proxyAvailable, setProxyAvailable] = useState(false);

    const t = theme || {
        bgSecondary: '#16161d',
        bgCard: '#1e1e2a',
        bgTertiary: '#1c1c26',
        accent: '#8b5cf6',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        border: 'rgba(255, 255, 255, 0.06)',
    };

    // Check if proxy server is running
    useEffect(() => {
        fetch('http://localhost:3001/proxy?url=test')
            .then(() => setProxyAvailable(true))
            .catch(() => setProxyAvailable(false));
    }, []);

    const getStreamUrl = (originalUrl) => {
        if (useProxy && proxyAvailable) {
            return LOCAL_PROXY + encodeURIComponent(originalUrl);
        }
        return originalUrl;
    };

    const toggleProxy = () => {
        setUseProxy(!useProxy);
        setError(null);
        setIsLoading(true);
    };

    useEffect(() => {
        if (!url) return;

        setIsLoading(true);
        setError(null);

        const video = videoRef.current;
        if (!video) return;

        const streamUrl = getStreamUrl(url);

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                xhrSetup: (xhr) => {
                    xhr.withCredentials = false;
                },
            });

            hlsRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoading(false);
                video.play().catch(() => setIsLoading(false));
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        if (!useProxy && proxyAvailable) {
                            setError('Stream blocked by CORS. Try enabling the proxy.');
                        } else {
                            setError('Stream unavailable or geo-restricted');
                        }
                    } else {
                        setError('Unable to play this stream');
                    }
                    setIsLoading(false);
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                setIsLoading(false);
                video.play().catch(() => setIsLoading(false));
            });
            video.addEventListener('error', () => {
                setError('Stream unavailable');
                setIsLoading(false);
            });
        } else {
            setError('HLS not supported');
            setIsLoading(false);
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [url, useProxy]);

    return (
        <div style={{
            background: t.bgSecondary,
            borderRadius: '16px',
            border: `1px solid ${t.border}`,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: t.bgCard,
                borderBottom: `1px solid ${t.border}`,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        background: error ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        color: error ? '#ef4444' : '#22c55e',
                    }}>
                        <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: error ? '#ef4444' : '#22c55e',
                            animation: error ? 'none' : 'pulse 1.5s ease-in-out infinite',
                        }}></span>
                        {error ? 'ERROR' : 'LIVE'}
                    </div>
                    <span style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: t.textPrimary,
                    }}>{channelName || 'Now Playing'}</span>
                    {useProxy && (
                        <span style={{
                            fontSize: '0.65rem',
                            padding: '2px 6px',
                            background: 'rgba(34, 197, 94, 0.2)',
                            borderRadius: '4px',
                            color: '#22c55e',
                        }}>PROXY ON</span>
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}>
                    {/* Proxy Toggle */}
                    {proxyAvailable && (
                        <button
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: useProxy ? 'rgba(34, 197, 94, 0.2)' : t.bgTertiary,
                                border: `1px solid ${useProxy ? 'rgba(34, 197, 94, 0.4)' : t.border}`,
                                color: useProxy ? '#22c55e' : t.textSecondary,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                            onClick={toggleProxy}
                            title={useProxy ? 'Disable Proxy' : 'Enable Proxy (for CORS blocked streams)'}
                        >
                            {useProxy ? <Shield size={18} /> : <ShieldOff size={18} />}
                        </button>
                    )}
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: t.bgTertiary,
                            border: `1px solid ${t.border}`,
                            color: t.textSecondary,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                        }}
                        onClick={() => {
                            if (videoRef.current) {
                                videoRef.current.muted = !videoRef.current.muted;
                                setIsMuted(!isMuted);
                            }
                        }}
                    >
                        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                    }} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Video */}
            <div style={{
                position: 'relative',
                aspectRatio: '16 / 9',
                background: '#000',
            }}>
                {isLoading && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: t.textSecondary,
                        zIndex: 5,
                    }}>
                        <Loader size={36} style={{ animation: 'spin 1s linear infinite' }} color={t.accent} />
                        <p>{useProxy ? 'Loading via proxy...' : 'Loading stream...'}</p>
                    </div>
                )}

                {error && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: t.textSecondary,
                        zIndex: 5,
                        textAlign: 'center',
                        padding: '20px',
                    }}>
                        <AlertCircle size={36} color="#ef4444" />
                        <p style={{ color: '#ef4444' }}>{error}</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                            {!useProxy && proxyAvailable
                                ? 'Click the shield icon to enable proxy mode'
                                : 'This stream may be geo-restricted or offline'}
                        </p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                            {!useProxy && proxyAvailable && (
                                <button style={{
                                    padding: '8px 16px',
                                    background: 'rgba(34, 197, 94, 0.2)',
                                    border: '1px solid rgba(34, 197, 94, 0.4)',
                                    borderRadius: '8px',
                                    color: '#22c55e',
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }} onClick={toggleProxy}>
                                    <Shield size={14} />
                                    Enable Proxy
                                </button>
                            )}
                            <button style={{
                                padding: '8px 16px',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                borderRadius: '8px',
                                border: 'none',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                            }} onClick={onClose}>
                                Try Another Channel
                            </button>
                        </div>
                    </div>
                )}

                {!proxyAvailable && error && (
                    <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '10px',
                        right: '10px',
                        padding: '10px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        color: '#f59e0b',
                        zIndex: 10,
                    }}>
                        💡 <strong>Tip:</strong> Run <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 4px', borderRadius: '3px' }}>node proxy-server.js</code> in terminal to enable proxy mode for blocked streams.
                    </div>
                )}

                <video
                    ref={videoRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }}
                    controls
                    playsInline
                    muted={isMuted}
                />
            </div>
        </div>
    );
};

export default VideoPlayer;