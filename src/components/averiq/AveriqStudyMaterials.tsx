import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  Search,
  Filter,
  FileText,
  Video,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Eye,
  X,
  Sparkles,
  ArrowDownToLine,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useIMS } from '../../context/IMSContext';

interface StudyMaterialItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  category: 'Notes' | 'Question Bank' | 'Solved Papers' | 'Formula Sheet' | 'Lab Manual';
  fileType: 'PDF' | 'DOCX' | 'MP4' | 'ZIP';
  fileSize: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  description: string;
  previewContent?: {
    summary: string;
    keyPoints: string[];
    sampleQuestions: string[];
  };
}

export const AveriqStudyMaterials: React.FC = () => {
  const { showToast } = useIMS();
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterialItem | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // New Upload Form
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: 'Mathematics',
    grade: 'Class 10',
    category: 'Notes' as const,
    fileType: 'PDF' as const,
    description: '',
    uploadedBy: 'Prof. Rajesh Sharma'
  });

  const [materials, setMaterials] = useState<StudyMaterialItem[]>([
    {
      id: 'mat-001',
      title: 'Class 10 - Quadratic Equations Complete Mastery Notes',
      subject: 'Mathematics',
      grade: 'Class 10',
      category: 'Notes',
      fileType: 'PDF',
      fileSize: '3.4 MB',
      uploadedBy: 'Prof. Rajesh Sharma',
      uploadDate: '24 Oct 2026',
      downloads: 142,
      description: 'Comprehensive derivation of quadratic formulas, discriminant analysis, nature of roots, and 45 solved textbook problems.',
      previewContent: {
        summary: 'Standard form ax² + bx + c = 0. Discriminant D = b² - 4ac. When D > 0 real and distinct roots; D = 0 equal roots; D < 0 non-real complex roots.',
        keyPoints: [
          'Quadratic formula: x = (-b ± √(b² - 4ac)) / 2a',
          'Sum of roots (α + β) = -b/a, Product of roots (αβ) = c/a',
          'Factorization method vs completing square method',
          'Word problems on speed-distance and upstream-downstream'
        ],
        sampleQuestions: [
          'Find the roots of 2x² - 7x + 3 = 0 using quadratic formula.',
          'If the roots of (k-12)x² + 2(k-12)x + 2 = 0 are equal, find the value of k.',
          'An express train takes 1 hour less than a passenger train to travel 132 km. Calculate their average speeds.'
        ]
      }
    },
    {
      id: 'mat-002',
      title: 'Class 10 - Light: Reflection & Refraction Ray Diagrams & Formulae',
      subject: 'Physics',
      grade: 'Class 10',
      category: 'Formula Sheet',
      fileType: 'PDF',
      fileSize: '2.8 MB',
      uploadedBy: 'Dr. Neha Kulkarni',
      uploadDate: '22 Oct 2026',
      downloads: 189,
      description: 'Concave and convex mirrors ray diagram cheat-sheet, lens maker signs convention rules, refractive index tables.',
      previewContent: {
        summary: 'Mirror formula 1/f = 1/v + 1/u. Magnification m = -v/u = h\'/h. Lens formula 1/f = 1/v - 1/u. Power of lens P = 1/f (in meters).',
        keyPoints: [
          'New Cartesian Sign Convention: Distances measured in direction of incident ray are positive.',
          'Refractive index n21 = v1 / v2 = sin(i) / sin(r) (Snell’s Law)',
          'Total internal reflection conditions and critical angle',
          'Focal length of concave mirror is negative; convex mirror is positive'
        ],
        sampleQuestions: [
          'A concave mirror produces three times magnified real image of an object placed at 10 cm. Find focal length.',
          'Calculate the focal length of a lens of power -2.0 D. What type of lens is this?'
        ]
      }
    },
    {
      id: 'mat-003',
      title: 'Class 10 - Chemical Reactions & Equations Solved Board Papers (2020-2025)',
      subject: 'Chemistry',
      grade: 'Class 10',
      category: 'Solved Papers',
      fileType: 'PDF',
      fileSize: '5.1 MB',
      uploadedBy: 'Prof. Amit Verma',
      uploadDate: '18 Oct 2026',
      downloads: 215,
      description: 'Past 5 years solved board examination questions with step-by-step balanced equations and color change observations.',
      previewContent: {
        summary: 'Types of reactions: Combination, Decomposition, Displacement, Double Displacement, Oxidation and Reduction (Redox).',
        keyPoints: [
          'Balancing chemical equations using Hit-and-Trial law of conservation of mass',
          'Thermal decomposition of Ferrous Sulphate and Lead Nitrate',
          'Corrosion and Rancidity prevention strategies',
          'Precipitation reactions: Barium Chloride + Sodium Sulphate'
        ],
        sampleQuestions: [
          'Write balanced chemical equation: Heating of Lead Nitrate powder in boiling tube.',
          'Identify substance oxidized and reduced in CuO + H2 -> Cu + H2O.'
        ]
      }
    },
    {
      id: 'mat-004',
      title: 'Class 9 - Polynomials & Factorization High-Yield Question Bank',
      subject: 'Mathematics',
      grade: 'Class 9',
      category: 'Question Bank',
      fileType: 'PDF',
      fileSize: '4.2 MB',
      uploadedBy: 'Prof. Rajesh Sharma',
      uploadDate: '15 Oct 2026',
      downloads: 98,
      description: '100 curated practice problems categorized by difficulty (Basic, Standard, Advanced Olympiad level) with full solutions.',
      previewContent: {
        summary: 'Factor Theorem, Remainder Theorem, Algebraic identities: (a+b+c)², (a±b)³, a³+b³+c³-3abc.',
        keyPoints: [
          'Remainder theorem: If p(x) is divided by (x-a), remainder is p(a)',
          'Factor theorem: (x-a) is factor if and only if p(a) = 0',
          'Splitting the middle term for quadratic polynomials',
          'Application of identity if a + b + c = 0 then a³ + b³ + c³ = 3abc'
        ],
        sampleQuestions: [
          'Factorize: 27x³ + y³ + z³ - 9xyz.',
          'Find the value of k if (x - 1) is a factor of 4x³ + 3x² - 4x + k.'
        ]
      }
    },
    {
      id: 'mat-005',
      title: 'Class 8 - Cell Structure & Microorganisms Lab Practical Guide',
      subject: 'Biology',
      grade: 'Class 8',
      category: 'Lab Manual',
      fileType: 'PDF',
      fileSize: '2.1 MB',
      uploadedBy: 'Dr. Priya Nair',
      uploadDate: '12 Oct 2026',
      downloads: 87,
      description: 'Microscope slide preparation manual: Onion peel cell, human cheek cell, staining procedures with methylene blue.',
      previewContent: {
        summary: 'Plant cell vs animal cell comparison: Cell wall, plastids/chloroplasts, large central vacuole presence in plant cells.',
        keyPoints: [
          'Nucleus contains chromosomes carrying genes (DNA)',
          'Prokaryotic vs Eukaryotic cell organization',
          'Bacteria, Fungi, Protozoa, Algae classification'
        ],
        sampleQuestions: [
          'Why are plant cells capable of tolerating greater variations in surrounding medium than animal cells?',
          'Label parts of a compound microscope and state precautions during slide preparation.'
        ]
      }
    },
    {
      id: 'mat-006',
      title: 'Class 10 - English Grammar & Essay Writing Master Templates',
      subject: 'English',
      grade: 'Class 10',
      category: 'Notes',
      fileType: 'PDF',
      fileSize: '1.9 MB',
      uploadedBy: 'Mrs. Sunita Rao',
      uploadDate: '08 Oct 2026',
      downloads: 165,
      description: 'Formal letter formats (Letters to Editor, Complaint Letters), analytical paragraph writing rubrics, and subject-verb agreement rules.',
      previewContent: {
        summary: 'Standard CBSE/ICSE formal letter format: Sender address, Date, Receiver designation/address, Subject, Salutation, Body in 3 paragraphs, Complimentary close.',
        keyPoints: [
          'Analytical paragraph writing: Introduction, Body of analysis with data comparison, Conclusion',
          'Reported Speech: Direct to Indirect rules for assertives, imperatives, interrogatives',
          'Modals, Determiners and Tenses error spotting'
        ],
        sampleQuestions: [
          'Write a letter to the Editor of a national daily highlighting the menace of e-waste in metropolitan cities.',
          'Analyze the provided pie chart showing teenager screen time distribution in 120 words.'
        ]
      }
    },
    {
      id: 'mat-007',
      title: 'Class 11 - Kinematics & Laws of Motion Master Problem Set',
      subject: 'Physics',
      grade: 'Class 11',
      category: 'Question Bank',
      fileType: 'PDF',
      fileSize: '6.2 MB',
      uploadedBy: 'Dr. Neha Kulkarni',
      uploadDate: '02 Oct 2026',
      downloads: 134,
      description: 'Calculus based derivations for equations of motion, projectile motion, circular motion, friction and Newton’s laws with free body diagrams.',
      previewContent: {
        summary: 'v = u + at, s = ut + ½at², v² = u² + 2as. Projectile Range R = (u² sin 2θ)/g, Max height H = (u² sin² θ)/2g.',
        keyPoints: [
          'Free body diagrams (FBD) for connected pulley systems',
          'Static and kinetic friction laws (fs ≤ μs N)',
          'Banking of roads on curved tracks with friction'
        ],
        sampleQuestions: [
          'Derive expression for trajectory of a projectile fired at angle θ with horizontal.',
          'A block of mass 5 kg rests on a rough horizontal surface with μ = 0.4. Calculate minimum force required to slide it.'
        ]
      }
    },
    {
      id: 'mat-008',
      title: 'Class 12 - Electrochemistry & Chemical Kinetics Formula Handbook',
      subject: 'Chemistry',
      grade: 'Class 12',
      category: 'Formula Sheet',
      fileType: 'PDF',
      fileSize: '3.1 MB',
      uploadedBy: 'Prof. Amit Verma',
      uploadDate: '28 Sep 2026',
      downloads: 178,
      description: 'Nernst equation quick reference, Kohlrausch’s law, Arrhenius equation, first order rate constant calculations.',
      previewContent: {
        summary: 'Ecell = E°cell - (0.0591/n) log Q at 298 K. ΔG° = -n F E°cell. First order kinetics: k = (2.303/t) log([A]0/[A]). Half life t1/2 = 0.693/k.',
        keyPoints: [
          'Molar conductivity Λm = (κ × 1000) / M',
          'Faraday’s laws of electrolysis: m = Z I t',
          'Arrhenius equation: k = A e^(-Ea/RT)'
        ],
        sampleQuestions: [
          'Calculate emf of cell at 298 K: Mg(s) | Mg²⁺(0.001 M) || Cu²⁺(0.0001 M) | Cu(s).',
          'A first order reaction is 50% complete in 20 minutes. Calculate time required for 90% completion.'
        ]
      }
    }
  ]);

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchGrade = selectedGrade === 'All' || m.grade === selectedGrade;
      const matchSubject = selectedSubject === 'All' || m.subject === selectedSubject;
      const matchCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGrade && matchSubject && matchCategory && matchSearch;
    });
  }, [materials, selectedGrade, selectedSubject, selectedCategory, searchQuery]);

  // Download Action
  const handleDownload = (material: StudyMaterialItem) => {
    setDownloadingId(material.id);
    setTimeout(() => {
      setDownloadingId(null);
      setMaterials(prev =>
        prev.map(item => item.id === material.id ? { ...item, downloads: item.downloads + 1 } : item)
      );
      showToast(`Downloading: ${material.title} (${material.fileSize})`);
    }, 700);
  };

  // Upload Action
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) {
      showToast('Please specify a title for the material.');
      return;
    }

    const newItem: StudyMaterialItem = {
      id: `mat-${Date.now()}`,
      title: uploadForm.title,
      subject: uploadForm.subject,
      grade: uploadForm.grade,
      category: uploadForm.category,
      fileType: uploadForm.fileType,
      fileSize: '2.5 MB',
      uploadedBy: uploadForm.uploadedBy,
      uploadDate: 'Just now',
      downloads: 1,
      description: uploadForm.description || 'Uploaded course study resource for student exam preparation.'
    };

    setMaterials([newItem, ...materials]);
    setIsUploadModalOpen(false);
    setUploadForm({
      title: '',
      subject: 'Mathematics',
      grade: 'Class 10',
      category: 'Notes',
      fileType: 'PDF',
      description: '',
      uploadedBy: 'Prof. Rajesh Sharma'
    });
    showToast(`"${newItem.title}" uploaded to library.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0B2545] to-[#0A192F] rounded-2xl p-6 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider border border-emerald-500/30">
              Digital Learning Repository
            </span>
            <span className="text-xs text-slate-400">AV Achievers LMS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1.5 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Study Materials & Digital Library</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Central repository of faculty lecture notes, formula sheets, solved board questions, and practice sets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Available Files</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {materials.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">Verified PDF & Docs</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Student Downloads</span>
            <ArrowDownToLine className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            {materials.reduce((acc, m) => acc + m.downloads, 0)}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">High campus engagement</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Subjects Covered</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            8 Subjects
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Class 8 to 12</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Faculty Contributors</span>
            <GraduationCap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            5 Faculty
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">Weekly curriculum updates</div>
        </div>
      </div>

      {/* 3. Search and Multi-level Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, chapter name, formula, or instructor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Categories</option>
              <option value="Notes">Notes</option>
              <option value="Question Bank">Question Bank</option>
              <option value="Solved Papers">Solved Papers</option>
              <option value="Formula Sheet">Formula Sheet</option>
              <option value="Lab Manual">Lab Manual</option>
            </select>
          </div>
        </div>

        {/* Grade and Subject Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-medium mr-1">Class:</span>
            {['All', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedGrade === g
                    ? 'bg-[#0056D6] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            <span className="text-slate-400 font-medium mr-1">Subject:</span>
            {['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSubject(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === s
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMaterials.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-blue-400/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                    {item.grade}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
                    {item.subject}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2.5 leading-snug">
                {item.title}
              </h3>

              <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {item.uploadedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {item.uploadDate}
                </span>
                <span className="font-mono text-slate-400">Size: {item.fileSize}</span>
                <span className="font-mono text-emerald-600 font-semibold">{item.downloads} downloads</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {item.previewContent ? (
                <button
                  type="button"
                  onClick={() => setPreviewMaterial(item)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Summary</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Direct Download</span>
              )}

              <button
                type="button"
                onClick={() => handleDownload(item)}
                disabled={downloadingId === item.id}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#0056D6] hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all active:scale-95 shadow-xs"
              >
                <Download className={`w-3.5 h-3.5 ${downloadingId === item.id ? 'animate-bounce' : ''}`} />
                <span>{downloadingId === item.id ? 'Downloading...' : 'Download File'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Document Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 text-xs font-mono font-bold">
                    {previewMaterial.grade}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{previewMaterial.subject}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {previewMaterial.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {previewMaterial.previewContent && (
              <div className="space-y-4 text-xs">
                {/* Concept Summary */}
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Executive Concept Summary</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {previewMaterial.previewContent.summary}
                  </p>
                </div>

                {/* Key Points */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Takeaways & Formulas:</span>
                  </h4>
                  <ul className="space-y-1.5 pl-2">
                    {previewMaterial.previewContent.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Questions */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span>High-Frequency Exam Problems:</span>
                  </h4>
                  <div className="space-y-2">
                    {previewMaterial.previewContent.sampleQuestions.map((q, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        <strong className="text-purple-600 mr-1.5">Q{idx + 1}.</strong>
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Uploaded by {previewMaterial.uploadedBy} · {previewMaterial.fileSize}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleDownload(previewMaterial);
                  setPreviewMaterial(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload New Study Resource</h3>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 10 - Arithmetic Progressions Question Bank"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Target Class</label>
                  <select
                    value={uploadForm.grade}
                    onChange={e => setUploadForm({ ...uploadForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Subject</label>
                  <select
                    value={uploadForm.subject}
                    onChange={e => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={e => setUploadForm({ ...uploadForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Question Bank">Question Bank</option>
                    <option value="Solved Papers">Solved Papers</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Lab Manual">Lab Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">File Format</label>
                  <select
                    value={uploadForm.fileType}
                    onChange={e => setUploadForm({ ...uploadForm, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="DOCX">Word Document</option>
                    <option value="ZIP">ZIP Archive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Description & Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Outline key topics covered, formulas included, and recommended practice time..."
                  value={uploadForm.description}
                  onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#0056D6] hover:bg-blue-600 text-white font-bold"
                >
                  Publish to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
