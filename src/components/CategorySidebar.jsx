import {
    Tv, Newspaper, Trophy, Film, Music, Gamepad2, Baby, Church,
    Sparkles, BookOpen, Utensils, Landmark, Heart, Mountain, Users,
    ShoppingBag, Clapperboard, Microscope, Cloud, Car, Smile, Globe,
    Radio, Video, Palette, Monitor, Leaf, MessageCircle, LayoutGrid
} from 'lucide-react';

const categoryIcons = {
    'all': LayoutGrid,
    'news': Newspaper,
    'sports': Trophy,
    'movies': Film,
    'music': Music,
    'entertainment': Sparkles,
    'kids': Baby,
    'religious': Church,
    'documentary': Video,
    'education': BookOpen,
    'cooking': Utensils,
    'lifestyle': Heart,
    'general': Tv,
    'animation': Gamepad2,
    'culture': Palette,
    'legislative': Landmark,
    'outdoor': Mountain,
    'family': Users,
    'shop': ShoppingBag,
    'series': Clapperboard,
    'science': Microscope,
    'weather': Cloud,
    'auto': Car,
    'comedy': Smile,
    'travel': Globe,
    'classic': Radio,
    'public': Monitor,
    'relax': Leaf,
    'interactive': MessageCircle,
    'business': Landmark,
};

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory, channelCounts }) => {
    const getIcon = (categoryId) => {
        const Icon = categoryIcons[categoryId] || Tv;
        return <Icon size={18} />;
    };

    return (
        <aside style={styles.sidebar}>
            <div style={styles.header}>
                <div style={styles.logo}>
                    <div style={styles.logoIcon}>
                        <Tv size={24} />
                    </div>
                    <span style={styles.logoText}>MyTv</span>
                </div>
            </div>

            <nav style={styles.nav}>
                <div style={styles.sectionTitle}>Categories</div>

                <button
                    style={{
                        ...styles.categoryItem,
                        ...(selectedCategory === 'all' ? styles.categoryItemActive : {})
                    }}
                    onClick={() => onSelectCategory('all')}
                >
                    <span style={styles.categoryIcon}>{getIcon('all')}</span>
                    <span style={styles.categoryName}>All Channels</span>
                    <span style={styles.categoryCount}>{channelCounts?.all || 0}</span>
                </button>

                {categories.map((category) => (
                    <button
                        key={category.id}
                        style={{
                            ...styles.categoryItem,
                            ...(selectedCategory === category.id ? styles.categoryItemActive : {})
                        }}
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <span style={styles.categoryIcon}>{getIcon(category.id)}</span>
                        <span style={styles.categoryName}>{category.name}</span>
                        <span style={styles.categoryCount}>{channelCounts?.[category.id] || 0}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

const styles = {
    sidebar: {
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
    },
    header: {
        padding: '24px 20px',
        borderBottom: '1px solid var(--border-subtle)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoIcon: {
        width: '44px',
        height: '44px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent-gradient)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 700,
        background: 'var(--accent-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    nav: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px 12px',
    },
    sectionTitle: {
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        padding: '8px 12px',
        marginBottom: '8px',
    },
    categoryItem: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: '4px',
    },
    categoryItemActive: {
        background: 'rgba(99, 102, 241, 0.15)',
        color: 'var(--accent-primary)',
    },
    categoryIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8,
    },
    categoryName: {
        flex: 1,
        textAlign: 'left',
    },
    categoryCount: {
        fontSize: '0.75rem',
        padding: '2px 8px',
        borderRadius: '9999px',
        background: 'var(--bg-card)',
        color: 'var(--text-muted)',
    },
};

export default CategorySidebar;
