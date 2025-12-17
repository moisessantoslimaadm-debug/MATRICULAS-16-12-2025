import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { MapPin, Users, School as SchoolIcon, Search, X, Star, Navigation, Filter, ChevronLeft, ChevronRight, HeartPulse, LayoutGrid, Map as MapIcon, CheckCircle2, AlertTriangle, XCircle, ChevronDown } from 'lucide-react';
import { School, SchoolType } from '../types';

declare const L: any;

interface SchoolCardProps {
  school: School;
  enrolledCount: number;
  onClick: (s: School) => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, enrolledCount, onClick }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = useMemo(() => (school.gallery && school.gallery.length > 0 ? school.gallery : [school.image]), [school]);

    const occupancy = school.availableSlots > 0 ? (enrolledCount / school.availableSlots) * 100 : 0;
    const getStatus = () => {
        if (occupancy >= 95) return { color: 'text-red-600', bg: 'bg-red-500', label: 'Lotada', icon: <XCircle className="h-3 w-3" /> };
        if (occupancy >= 80) return { color: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Vagas Limitadas', icon: <AlertTriangle className="h-3 w-3" /> };
        return { color: 'text-green-600', bg: 'bg-green-500', label: 'Vagas Disponíveis', icon: <CheckCircle2 className="h-3 w-3" /> };
    };

    const status = getStatus();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group flex flex-col">
            <div className="h-52 relative overflow-hidden bg-slate-200">
                <img 
                    src={images[currentImageIndex]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={school.name} 
                />
                
                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p - 1 + images.length) % images.length); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p + 1) % images.length); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}

                {/* Dots Indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
                    ))}
                </div>

                <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-white/95 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm border border-slate-100">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {school.rating.toFixed(1)}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight line-clamp-2">{school.name}</h3>
                    {school.hasAEE && (
                        <div className="bg-pink-100 text-pink-600 p-1.5 rounded-lg" title="AEE Disponível">
                            <HeartPulse className="h-4 w-4 animate-pulse" />
                        </div>
                    )}
                </div>
                
                <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className="line-clamp-2">{school.address}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            {status.icon} {status.label}
                        </span>
                        <span className={`font-bold ${status.color}`}>{enrolledCount} / {school.availableSlots} vagas</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${status.bg}`} style={{ width: `${Math.min(occupancy, 100)}%` }} />
                    </div>
                    <button 
                        onClick={() => onClick(school)}
                        className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2"
                    >
                        <Users className="h-4 w-4" /> Detalhes e Quadro
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SchoolList: React.FC = () => {
  const { schools, students } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showAEE, setShowAEE] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const getEnrolled = useCallback((name: string) => students.filter(s => s.school === name && s.status === 'Matriculado').length, [students]);

  const filteredSchools = useMemo(() => schools.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || s.types.includes(selectedType as SchoolType);
    const matchesAEE = !showAEE || s.hasAEE;
    return matchesSearch && matchesType && matchesAEE;
  }), [schools, searchTerm, selectedType, showAEE]);

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !markersLayerRef.current) return;
    const map = mapRef.current;
    const bounds = map.getBounds();
    markersLayerRef.current.clearLayers();

    filteredSchools.forEach(school => {
        // LAZY LOADING: Só renderiza o que está no viewport
        if (bounds.contains([school.lat, school.lng])) {
            const enrolled = getEnrolled(school.name);
            const occ = (enrolled / school.availableSlots) * 100;
            const color = occ >= 95 ? '#ef4444' : occ >= 80 ? '#eab308' : '#22c55e';

            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); animation: markerBounce 0.5s ease-out;"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            L.marker([school.lat, school.lng], { icon })
                .bindPopup(`<div class="text-center font-bold text-slate-800 p-1">${school.name}<br/><span class="text-[10px] text-slate-400 font-normal">${enrolled}/${school.availableSlots} vagas</span></div>`, { closeButton: false })
                .addTo(markersLayerRef.current);
        }
    });
  }, [filteredSchools, getEnrolled]);

  useEffect(() => {
    if (viewMode === 'map' && !mapRef.current) {
        const map = L.map('main-map', { attributionControl: false, zoomControl: true }).setView([-12.5253, -40.2917], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        markersLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
        map.on('moveend', updateMarkers);
    }
    if (viewMode === 'map') {
        setTimeout(() => { mapRef.current?.invalidateSize(); updateMarkers(); }, 100);
    }
  }, [viewMode, updateMarkers]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Escolas Municipais</h1>
          <p className="text-slate-600 mt-2">Localize a unidade ideal para seu filho perto de casa.</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 sticky top-20 z-30 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Buscar escola..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex gap-2">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-4 py-3 border border-slate-200 rounded-lg text-sm bg-white outline-none appearance-none pr-10 relative">
                <option value="">Todas as Etapas</option>
                {Object.values(SchoolType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={() => setShowAEE(!showAEE)} className={`px-4 py-3 rounded-lg border font-bold flex items-center gap-2 transition ${showAEE ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white text-slate-600'}`}>
                <HeartPulse className="h-5 w-5" /> AEE
            </button>
            <div className="bg-slate-100 p-1 rounded-lg flex border">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><LayoutGrid className="h-5 w-5" /></button>
                <button onClick={() => setViewMode('map')} className={`p-2 rounded ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><MapIcon className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map(s => <SchoolCard key={s.id} school={s} enrolledCount={getEnrolled(s.name)} onClick={setSelectedSchool} />)}
            </div>
        ) : (
            <div id="main-map" className="h-[600px] w-full rounded-2xl border border-slate-300 shadow-inner z-10" />
        )}
      </div>

      <style>{`
        @keyframes markerBounce {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};