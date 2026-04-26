import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { 
  Play, Search, Star, Flame, X, BookmarkPlus, 
  Home as HomeIcon, Compass, Calendar, Bookmark,
  MonitorPlay, Server, Settings2, PlusCircle
} from 'lucide-react'

// --- DATA DUMMY ---
const HERO_ANIME = {
  id: 99,
  title: "Jujutsu Kaisen: Shibuya Arc",
  synopsis: "Insiden Shibuya dimulai. Aliansi kutukan berencana menyegel Satoru Gojo di stasiun Shibuya.",
  cover: "https://images.unsplash.com/photo-1618336753974-aae8e0450654?q=80&w=1920&auto=format&fit=crop",
  genres: ["Action", "Dark Fantasy"],
  type: "TV",
  rating: "4.9",
  studio: "MAPPA",
  year: "2023"
}

const TERBARU =[
  { id: 1, title: "Solo Leveling", ep: "Ep 09", type: "TV", year: "2024", studio: "A-1 Pictures", genres: ["Action", "Fantasy"], synopsis: "Perjalanan Sung Jin-Woo dari hunter terlemah menjadi yang terkuat.", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" },
  { id: 2, title: "Frieren: Beyond", ep: "Ep 25", type: "TV", year: "2023", studio: "Madhouse", genres: ["Adventure", "Drama"], synopsis: "Kisah elf Frieren setelah mengalahkan raja iblis.", poster: "https://images.unsplash.com/photo-1580477651161-11b428d08596?q=80&w=400&auto=format&fit=crop" },
  { id: 3, title: "One Piece", ep: "Ep 1096", type: "TV", year: "1999", studio: "Toei", genres: ["Action", "Adventure"], synopsis: "Petualangan Luffy menjadi Raja Bajak Laut.", poster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop" },
  { id: 4, title: "Ninja Kamui", ep: "Ep 04", type: "ONA", year: "2024", studio: "E&H", genres: ["Action", "Sci-Fi"], synopsis: "Mantan ninja yang membalas dendam atas kematian keluarganya.", poster: "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=400&auto=format&fit=crop" },
  { id: 5, title: "Demon Slayer", ep: "Movie", type: "Movie", year: "2024", studio: "ufotable", genres: ["Action", "Supernatural"], synopsis: "Pelatihan Hashira dimulai sebelum perang akhir.", poster: "https://images.unsplash.com/photo-1618336753974-aae8e0450654?q=80&w=400&auto=format&fit=crop" },
  { id: 6, title: "Blue Lock", ep: "Ep 24", type: "TV", year: "2022", studio: "8bit", genres: ["Sports", "Thriller"], synopsis: "Proyek gila untuk melahirkan striker terbaik Jepang.", poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" }
]

// --- KOMPONEN POP-UP (MODAL) ---
const AnimeModal = ({ anime, onClose }) => {
  if (!anime) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-gray-900 border border-gray-700/50 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Tombol Close Silang */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 bg-gray-950/50 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors">
          <X size={20} />
        </button>

        {/* Gambar Poster Kiri */}
        <div className="md:w-2/5 h-64 md:h-auto relative">
          <img src={anime.poster || anime.cover} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent md:bg-gradient-to-r"></div>
        </div>

        {/* Detail Kanan */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="flex gap-2 text-xs font-bold mb-3">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{anime.type}</span>
            <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">{anime.year}</span>
            <span className="bg-gray-800 text-purple-400 px-3 py-1 rounded-full border border-gray-700">{anime.studio}</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{anime.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {anime.genres.map(g => <span key={g} className="text-xs text-blue-400 font-medium">#{g}</span>)}
          </div>
          
          <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{anime.synopsis}</p>
          
          {/* Kotak Pencarian Episode */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder="Cari Episode... (Contoh: 12)" 
              className="w-full bg-gray-950 border border-gray-800 text-white text-sm rounded-full pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 mt-auto">
            <Link to={`/watch/${anime.id}`} onClick={onClose} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-full font-bold shadow-lg shadow-blue-600/30 transition-transform active:scale-95">
              <Play size={18} className="fill-white" /> Tonton
            </Link>
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-3.5 rounded-full font-bold transition-colors border border-gray-700">
              <BookmarkPlus size={18} /> Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- HALAMAN HOME ---
const Home = ({ onOpenModal }) => (
  <div className="space-y-8 pb-24 pt-20"> {/* pt-20 biar ga ketutup header */}
    
    {/* HERO SECTION */}
    <div className="relative w-full h-[50vh] sm:h-[60vh] rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer" onClick={() => onOpenModal(HERO_ANIME)}>
      <img src={HERO_ANIME.cover} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-6 sm:p-10 w-full max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white drop-shadow-lg">{HERO_ANIME.title}</h1>
        <p className="text-gray-300 text-sm sm:text-base line-clamp-2">{HERO_ANIME.synopsis}</p>
        <div className="pt-2">
          <button className="inline-flex items-center gap-2 bg-white text-gray-950 px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">
            <Play size={18} className="fill-gray-950" /> Detail & Nonton
          </button>
        </div>
      </div>
    </div>

    {/* GRID 3 KOLOM */}
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Flame className="text-blue-500 fill-blue-500/20" size={24} />
        <h2 className="text-xl font-bold text-white">Rilis Terbaru</h2>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {TERBARU.map((anime) => (
          <div key={anime.id} onClick={() => onOpenModal(anime)} className="group relative rounded-2xl overflow-hidden cursor-pointer bg-gray-900 border border-gray-800/50 shadow-lg hover:border-blue-500/50 transition-colors">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img src={anime.poster} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play size={32} className="text-white fill-white drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <div className="absolute top-2 left-2 bg-gray-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-blue-400 border border-gray-700/50">
                {anime.ep}
              </div>
            </div>
            <div className="p-3 bg-gradient-to-t from-gray-950 to-gray-900">
              <h3 className="font-bold text-white truncate text-xs sm:text-sm group-hover:text-blue-400 transition-colors">{anime.title}</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{anime.type} • {anime.studio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// --- HALAMAN NONTON (WATCH) ---
const Watch = () => {
  const [server, setServer] = useState('Server 1');
  const [res, setRes] = useState('720p');
  
  const servers = ['Server 1', 'Server 2', 'Server 3'];
  const resolutions =['360p', '480p', '720p', '1080p'];

  return (
    <div className="pb-24 pt-24 max-w-5xl mx-auto space-y-6">
      {/* Player Area Placeholder */}
      <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative flex items-center justify-center group">
        <MonitorPlay size={64} className="text-gray-700 group-hover:text-blue-500 transition-colors" />
        <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur px-4 py-2 rounded-full text-sm font-bold text-white border border-gray-700">
          Sedang Memutar: Episode 01
        </div>
      </div>

      {/* Kontrol Server & Resolusi */}
      <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 space-y-6 shadow-xl">
        {/* Row Server */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-bold min-w-[100px]">
            <Server size={18}/> Pilih Server
          </div>
          <div className="flex flex-wrap gap-2">
            {servers.map(s => (
              <button 
                key={s} 
                onClick={() => setServer(s)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${server === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-950 text-gray-400 hover:bg-gray-800 border border-gray-800'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px w-full bg-gray-800"></div>

        {/* Row Resolusi */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-bold min-w-[100px]">
            <Settings2 size={18}/> Resolusi
          </div>
          <div className="flex flex-wrap gap-2">
            {resolutions.map(r => (
              <button 
                key={r} 
                onClick={() => setRes(r)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${res === r ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-gray-950 text-gray-400 hover:bg-gray-800 border border-gray-800'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Anime Bawahnya */}
      <div className="p-6 bg-gray-900 rounded-3xl border border-gray-800">
        <h1 className="text-2xl font-black text-white mb-2">Solo Leveling</h1>
        <p className="text-gray-400 text-sm leading-relaxed">Pilih server di atas jika video tidak dapat diputar. Gunakan resolusi 1080p untuk pengalaman maksimal.</p>
      </div>
    </div>
  )
}

// --- HALAMAN ADMIN (TERSEMBUNYI TANPA TOMBOL) ---
const Admin = () => (
  <div className="pb-24 pt-24 max-w-4xl mx-auto space-y-6">
    <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-8 rounded-[2rem] border border-gray-700/50 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/30"><PlusCircle className="text-white"/></div>
        <h2 className="text-3xl font-black text-white">Input Data Baru</h2>
      </div>
      
      <form className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400 pl-2">Judul Anime</label>
          <input type="text" className="w-full bg-gray-950/80 border border-gray-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Masukkan judul..." />
        </div>
        
        <div className="grid grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 pl-2">Tipe</label>
            <select className="w-full bg-gray-950/80 border border-gray-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 appearance-none">
              <option>TV</option><option>Movie</option><option>OVA</option><option>ONA</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 pl-2">Studio</label>
            <input type="text" className="w-full bg-gray-950/80 border border-gray-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500" placeholder="MAPPA, dll..." />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400 pl-2">Sinopsis</label>
          <textarea rows="4" className="w-full bg-gray-950/80 border border-gray-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 custom-scrollbar" placeholder="Ceritakan kisahnya..."></textarea>
        </div>

        <button type="button" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all mt-4">
          Simpan ke Database D1
        </button>
      </form>
    </div>
  </div>
)

// --- MESIN UTAMA APP ---
function App() {
  const [selectedAnime, setSelectedAnime] = useState(null);
  const location = useLocation();

  // Scroll ke atas setiap pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100 selection:bg-blue-500/30 font-sans">
      
      {/* HEADER NAVBAR FIXED MENGAMBANG DI ATAS */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/60 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            NIME<span className="text-white">STREAM</span>
          </Link>
          
          <div className="relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Cari anime..." 
              className="bg-gray-900 border border-gray-800 text-sm text-white rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 focus:w-80 transition-all duration-300"
            />
          </div>
          {/* Tombol Search Mobile */}
          <button className="sm:hidden p-2 text-gray-400 hover:text-white"><Search size={20}/></button>
        </div>
      </nav>

      {/* POP-UP MODAL (Muncul kalau ada anime dipilih) */}
      <AnimeModal anime={selectedAnime} onClose={() => setSelectedAnime(null)} />

      {/* AREA KONTEN (Pindah Halaman) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Routes>
          <Route path="/" element={<Home onOpenModal={setSelectedAnime} />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

      {/* BOTTOM NAVIGATION (Gaya Aplikasi Mobile Nempel di Bawah) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800/80 pb-safe">
        <div className="max-w-md mx-auto flex justify-between items-center px-8 py-3">
          <Link to="/" className="flex flex-col items-center gap-1 text-blue-500 group">
            <div className="p-1.5 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors"><HomeIcon size={20} /></div>
            <span className="text-[10px] font-bold">Home</span>
          </Link>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-full"><Compass size={20} /></div>
            <span className="text-[10px] font-bold">Genre</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-full"><Calendar size={20} /></div>
            <span className="text-[10px] font-bold">Jadwal</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-300 transition-colors">
            <div className="p-1.5 rounded-full"><Bookmark size={20} /></div>
            <span className="text-[10px] font-bold">List</span>
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default App
