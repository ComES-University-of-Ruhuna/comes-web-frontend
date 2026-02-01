// ============================================
// ComES Website - Futuristic Icon Exports
// Using Lucide React for modern, consistent icons
// ============================================

// Re-export commonly used icons from lucide-react
// These are modern, futuristic style icons

export {
  // Navigation & UI
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ExternalLink,
  Home,
  Search,
  Filter,
  SlidersHorizontal,
  Settings,
  MoreHorizontal,
  MoreVertical,
  Grip,
  
  // Actions
  Plus,
  Minus,
  Check,
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Ban,
  
  // Theme
  Sun,
  Moon,
  Monitor,
  Palette,
  
  // Communication
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Send,
  Bell,
  BellRing,
  Inbox,
  
  // Social Media
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Link2,
  
  // Users & People
  User,
  Users,
  UserPlus,
  UserCheck,
  UserCircle,
  Users2,
  PersonStanding,
  Handshake,
  HeartHandshake,
  
  // Content
  FileText,
  File,
  Files,
  FolderOpen,
  Folder,
  Image,
  Images,
  Video,
  Play,
  Pause,
  
  // Calendar & Time
  Calendar,
  CalendarDays,
  CalendarCheck,
  Clock,
  Timer,
  History,
  Hourglass,
  
  // Location
  MapPin,
  Map,
  Navigation,
  Compass,
  Building,
  Building2,
  
  // Tech & Development
  Code,
  Code2,
  Terminal,
  Cpu,
  Server,
  Database,
  Cloud,
  Wifi,
  Bluetooth,
  Zap,
  Sparkles,
  Bot,
  Braces,
  Binary,
  CircuitBoard,
  
  // Security
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  Scan,
  ScanFace,
  
  // Awards & Achievements
  Award,
  Trophy,
  Medal,
  Star,
  Crown,
  Gem,
  Target,
  Flag,
  Rocket,
  
  // Education
  GraduationCap,
  BookOpen,
  Book,
  Library,
  Lightbulb,
  Brain,
  Microscope,
  FlaskConical,
  
  // Business
  Briefcase,
  TrendingUp,
  TrendingDown,
  BarChart,
  BarChart2,
  PieChart,
  LineChart,
  Activity,
  
  // Interface Elements
  Layers,
  Layout as LayoutIcon,
  LayoutGrid,
  Grid3X3,
  Table,
  Columns,
  Rows,
  Maximize,
  Minimize,
  
  // Misc Futuristic
  Atom,
  Orbit,
  Hexagon,
  Pentagon,
  Octagon,
  Triangle,
  Circle,
  Square,
  Boxes,
  Box,
  Package,
  Puzzle,
  
  // Arrows & Directions
  MoveRight,
  MoveLeft,
  MoveUp,
  MoveDown,
  CornerDownRight,
  CornerUpRight,
  RefreshCw,
  RotateCw,
  Repeat,
  Shuffle,
  
  // Loading States
  Loader,
  Loader2,
  LoaderCircle,
  LoaderPinwheel,
  
  // Scroll & Chevrons
  ChevronsRight,
  ChevronsLeft,
  ChevronsUp,
  ChevronsDown,
  ScrollText,
  MousePointer,
  MousePointerClick,
  Hand,
  
  // Creative
  Wand2,
  Brush,
  PenTool,
  Pencil,
  Eraser,
  Paintbrush,
  
  // Network & Connection
  Network,
  Share2,
  GitBranch,
  GitFork,
  GitMerge,
  Workflow,
  
  // Reactions
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Laugh,
  
  // Volume & Media
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Radio,
  Music,
  
  // Download & Upload
  Download,
  Upload,
  CloudDownload,
  CloudUpload,
  Import,
  
  // Edit
  Edit,
  Edit2,
  Edit3,
  Copy,
  Clipboard,
  ClipboardCheck,
  Trash,
  Trash2,
  Save,
  
  // Contact & Form
  Contact,
  Contact2,
  AtSign,
  Hash,
  
  // Misc
  Quote,
  Newspaper,
  Rss,
  Bookmark,
  Tag,
  Tags,
  Pin,
  PinOff,
  Flame,
  Snowflake,
  Anchor,
} from 'lucide-react';

// Icon component with preset sizes
import type { LucideIcon, LucideProps } from 'lucide-react';

export interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <IconComponent
      size={sizeMap[size]}
      className={className}
      {...props}
    />
  );
};
