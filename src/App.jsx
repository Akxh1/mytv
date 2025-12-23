import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader, WifiOff, Tv, X, Sun, Moon } from 'lucide-react';
import VideoPlayer from './components/VideoPlayer';
import ChannelCard from './components/ChannelCard';

const API_CHANNELS = 'https://iptv-org.github.io/api/channels.json';
const API_STREAMS = 'https://iptv-org.github.io/api/streams.json';
const API_LOGOS = 'https://iptv-org.github.io/api/logos.json';

const CATEGORY_LIST = [
  { id: 'all', name: 'All Channels', icon: '📺' },
  { id: 'news', name: 'News', icon: '📰' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'movies', name: 'Movies', icon: '🎬' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
  { id: 'kids', name: 'Kids', icon: '🧸' },
  { id: 'documentary', name: 'Documentary', icon: '🎥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'religious', name: 'Religious', icon: '⛪' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '💫' },
  { id: 'cooking', name: 'Cooking', icon: '🍳' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'animation', name: 'Animation', icon: '🎨' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'general', name: 'General', icon: '📡' },
];

// Theme colors
const themes = {
  dark: {
    bgPrimary: '#0f0f14',
    bgSecondary: '#16161d',
    bgTertiary: '#1c1c26',
    bgCard: '#1e1e2a',
    bgCardHover: '#262636',
    bgLogoArea: '#3a3a4a', // Lighter for logos
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.15)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    border: 'rgba(255, 255, 255, 0.06)',
    borderHover: 'rgba(139, 92, 246, 0.4)',
  },
  light: {
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    bgCard: '#ffffff',
    bgCardHover: '#f8fafc',
    bgLogoArea: '#e2e8f0', // Subtle gray for logos
    accent: '#7c3aed',
    accentGlow: 'rgba(124, 58, 237, 0.12)',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(124, 58, 237, 0.4)',
  }
};

// Create context for theme
import { createContext, useContext } from 'react';
export const ThemeContext = createContext(themes.dark);

function App() {
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mytv-theme');
    return saved ? saved === 'dark' : true;
  });

  const theme = isDark ? themes.dark : themes.light;

  // Persist theme
  useEffect(() => {
    localStorage.setItem('mytv-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Fetch data
  const { data: channels = [], isLoading: loadingChannels } = useQuery({
    queryKey: ['channels'],
    queryFn: () => fetch(API_CHANNELS).then(res => res.json()),
    staleTime: 1000 * 60 * 10,
  });

  const { data: streams = [], isLoading: loadingStreams } = useQuery({
    queryKey: ['streams'],
    queryFn: () => fetch(API_STREAMS).then(res => res.json()),
    staleTime: 1000 * 60 * 10,
  });

  const { data: logos = [], isLoading: loadingLogos } = useQuery({
    queryKey: ['logos'],
    queryFn: () => fetch(API_LOGOS).then(res => res.json()),
    staleTime: 1000 * 60 * 10,
  });

  // Create stream map
  const streamMap = useMemo(() => {
    const map = new Map();
    streams.forEach(stream => {
      if (stream.channel && stream.url) {
        if (!map.has(stream.channel)) {
          map.set(stream.channel, stream.url);
        }
      }
    });
    return map;
  }, [streams]);

  // Create logo map (channel id -> logo url)
  const logoMap = useMemo(() => {
    const map = new Map();
    logos.forEach(logo => {
      if (logo.channel && logo.url && !map.has(logo.channel)) {
        map.set(logo.channel, logo.url);
      }
    });
    return map;
  }, [logos]);

  // Filter channels with streams and add logos
  const channelsWithStreams = useMemo(() => {
    return channels
      .filter(channel => streamMap.has(channel.id) && !channel.is_nsfw)
      .map(channel => ({
        ...channel,
        logo: logoMap.get(channel.id) || null
      }));
  }, [channels, streamMap, logoMap]);

  // Count channels per category
  const channelCounts = useMemo(() => {
    const counts = { all: channelsWithStreams.length };
    channelsWithStreams.forEach(channel => {
      channel.categories?.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [channelsWithStreams]);

  // Filter by category and search
  const filteredChannels = useMemo(() => {
    let filtered = channelsWithStreams;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ch => ch.categories?.includes(selectedCategory));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ch =>
        ch.name.toLowerCase().includes(term) ||
        ch.country?.toLowerCase().includes(term)
      );
    }

    return filtered.slice(0, 150);
  }, [channelsWithStreams, selectedCategory, searchTerm]);

  const handlePlay = useCallback((channel) => {
    const url = streamMap.get(channel.id);
    if (url) {
      setSelectedStream(url);
      setSelectedChannel(channel);
    }
  }, [streamMap]);

  const handleClose = useCallback(() => {
    setSelectedStream(null);
    setSelectedChannel(null);
  }, []);

  const isLoading = loadingChannels || loadingStreams || loadingLogos;

  const styles = {
    app: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: theme.bgPrimary,
      transition: 'background-color 0.3s ease',
    },
    sidebar: {
      width: '260px',
      minWidth: '260px',
      height: '100vh',
      background: theme.bgSecondary,
      borderRight: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
    },
    logoSection: {
      padding: '16px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logoText: {
      fontSize: '1.4rem',
      fontWeight: 700,
      color: theme.textPrimary,
    },
    themeToggle: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: theme.bgTertiary,
      border: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.textSecondary,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    nav: {
      flex: 1,
      overflowY: 'auto',
      padding: '12px 8px',
    },
    navLabel: {
      fontSize: '0.7rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: theme.textMuted,
      padding: '8px 12px 12px',
    },
    navItem: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '8px',
      fontSize: '0.88rem',
      fontWeight: 500,
      color: theme.textSecondary,
      marginBottom: '2px',
      transition: 'all 0.15s ease',
      background: 'transparent',
    },
    navItemActive: {
      background: theme.accentGlow,
      color: theme.accent,
    },
    navIcon: {
      fontSize: '1rem',
    },
    navName: {
      flex: 1,
      textAlign: 'left',
    },
    navCount: {
      fontSize: '0.72rem',
      padding: '2px 7px',
      background: theme.bgTertiary,
      borderRadius: '10px',
      color: theme.textMuted,
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      padding: '16px 24px',
      borderBottom: `1px solid ${theme.border}`,
      background: theme.bgPrimary,
      flexShrink: 0,
      transition: 'all 0.3s ease',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '12px',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: theme.textPrimary,
    },
    channelCount: {
      fontSize: '0.85rem',
      color: theme.textMuted,
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      background: theme.bgTertiary,
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      width: '280px',
      transition: 'all 0.3s ease',
    },
    searchInput: {
      flex: 1,
      fontSize: '0.88rem',
      color: theme.textPrimary,
      background: 'transparent',
    },
    clearBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: theme.border,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px 24px',
      background: theme.bgPrimary,
    },
    playerSection: {
      marginBottom: '24px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '16px',
    },
    centerState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '60px 20px',
      color: theme.textMuted,
      textAlign: 'center',
    },
    emptyTitle: {
      fontSize: '1.1rem',
      color: theme.textSecondary,
      fontWeight: 600,
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div style={styles.app}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <Tv size={22} color={theme.accent} />
              <span style={styles.logoText}>MyTv</span>
            </div>
            <button
              style={styles.themeToggle}
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <nav style={styles.nav}>
            <div style={styles.navLabel}>Categories</div>
            {CATEGORY_LIST.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  ...styles.navItem,
                  ...(selectedCategory === cat.id ? styles.navItemActive : {})
                }}
              >
                <span style={styles.navIcon}>{cat.icon}</span>
                <span style={styles.navName}>{cat.name}</span>
                <span style={styles.navCount}>{channelCounts[cat.id] || 0}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          {/* Header */}
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              <h1 style={styles.title}>
                {CATEGORY_LIST.find(c => c.id === selectedCategory)?.name || 'Channels'}
              </h1>
              <span style={styles.channelCount}>
                {filteredChannels.length} channels
              </span>
            </div>

            <div style={styles.searchBox}>
              <Search size={18} color={theme.textMuted} />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} style={styles.clearBtn}>
                  <X size={14} />
                </button>
              )}
            </div>
          </header>

          {/* Content Area */}
          <div style={styles.content}>
            {/* Video Player */}
            {selectedStream && (
              <div style={styles.playerSection}>
                <VideoPlayer
                  url={selectedStream}
                  channelName={selectedChannel?.name}
                  onClose={handleClose}
                  theme={theme}
                />
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div style={styles.centerState}>
                <Loader size={36} style={{ animation: 'spin 1s linear infinite' }} color={theme.accent} />
                <p>Loading channels...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredChannels.length === 0 && (
              <div style={styles.centerState}>
                <WifiOff size={40} color={theme.textMuted} />
                <h3 style={styles.emptyTitle}>No channels found</h3>
                <p>Try a different search or category</p>
              </div>
            )}

            {/* Channel Grid */}
            {!isLoading && filteredChannels.length > 0 && (
              <div style={styles.grid}>
                {filteredChannels.map(channel => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    onPlay={handlePlay}
                    isPlaying={selectedChannel?.id === channel.id}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;