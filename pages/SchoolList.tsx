import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from '../router';
import { 
  MapPin, Users, School as SchoolIcon, Search, X, Star, 
  Navigation, Filter, ChevronLeft, ChevronRight, HeartPulse, 
  LayoutGrid, Map as MapIcon, CheckCircle2, AlertTriangle, 
  XCircle, ChevronDown, Edit2, Save, Loader2, Info, ArrowRight, 
  Hash, LayoutList
} from 'lucide-react';
import { School, SchoolType } from '../types';

declare const L: any;

interface SchoolCardProps {
  school: School;
  enrolledCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit?: (s: School) => void;
  isAdmin: boolean;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, enrolledCount, isExpanded, onToggleExpand, onEdit, isAdmin }) => {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = useMemo(() => (school.gallery && school.gallery.length > 0 ? school.gallery : [school.image]), [school]);

    // Cálculo de disponibilidade conforme solicitado:
    // Verde: > 50% das vagas disponíveis
    // Amarelo: 10% - 50% das vagas disponíveis
    // Vermelho: < 10% das vagas disponíveis
    const totalSlots = school.availableSlots || 0;
    const availablePercent = totalSlots > 0 ? ((totalSlots - enrolledCount) / totalSlots) * 100 : 0;

    const getStatus = () => {
        if (availablePercent < 10) return { color: 'text-red-600', bg: 'bg-red-500', label: 'Vagas Escassas', icon: <XCircle className="h-3 w-3" /> };
        if (availablePercent <= 50) return { color: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Vagas Médias', icon: <AlertTriangle className="h-3 w-3" /> };
        return { color: 'text-green-600', bg: 'bg-green-500', label: 'Alta Disponibilidade', icon: <CheckCircle2 className="h-3 w-3" /> };
    };

    const status = getStatus();

    const handleEnrollClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate('/registration');
    };

    return (
        <div 
            onClick={onToggleExpand}
            className={`bg-white rounded-3xl shadow-sm border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col relative ${
                isExpanded ? 'ring-2 ring-blue-500 border-transparent shadow-xl scale-[1.02] z-20' : 'border-slate-200 hover:shadow-md hover:border-slate-300'
            }`}
        >
            {isAdmin && onEdit && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(school); }}
                    className="absolute top-3 right-3 z-30 bg-white/90 hover:bg-blue-600 hover:text-white text-slate-600 p-2 rounded-xl shadow-lg backdrop-blur-sm transition-all border border-slate-200"
                    title="Editar Escola"
                >
                    <Edit2 className="h-4 w-4" />
                </button>
            )}

            <div className={`relative overflow-hidden bg-slate-200 transition-all duration-500 ${isExpanded ? 'h-64' : 'h-48'}`}>
                <img 
                    src={images[currentImageIndex]} 
                    className="w-full h-full object-cover transition-transform duration-700" 
                    alt={school.name} 
                />
                
                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p - 1 + images.length) % images.length); }}
                            className="bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(p => (p + 1) % images.length); }}
                            className="bg-black/30 hover:bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Carousel Page Indicators (Bolinhas) */}
                {images.length > 1 && (
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-20">
                        {images.map((_, i) => (
                            <div 
                                key={i} 
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute bottom-4 left-4 z-10">
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md bg-white/90 ${status.color}`}>
                        {status.icon} {status.label}
                    </div>
                </div>

                <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-white/95 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm border border-slate-100">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {school.rating.toFixed(1)}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col group">
                <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className={`font-bold text-slate-900 leading-tight transition-all ${isExpanded ? 'text-xl' : 'text-lg line-clamp-2'}`}>
                        {school.name}
                    </h3>
                    {school.hasAEE && (
                        <div className="bg-pink-100 text-pink-600 p-1.5 rounded-lg shrink-0" title="AEE Disponível">
                            <HeartPulse className="h-4 w-4 animate-pulse" />
                        </div>
                    )}
                </div>
                
                <div className="flex items-start gap-2 text-slate-500 text-sm mb-4">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
                    <span className={isExpanded ? '' : 'line-clamp-1'}>{school.address}</span>
                </div>

                {/* Progress Bar (Availability Based) */}
                <div className="mb-4">
                    <div className="flex justify-between items-center text-[10px] mb-1.5">
                        <span className="text-slate-400 font-bold uppercase tracking-wider">Vagas Preenchidas</span>
                        <span className={`font-bold text-slate-700`}>{enrolledCount} / {totalSlots}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${status.bg}`} 
                            style={{ width: `${Math.min((enrolledCount / totalSlots) * 100, 100)}%` }} 
                        />
                    </div>
                </div>

                <div className={`grid transition-all duration-500 overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="min-h-0 space-y-4 pt-2">
                        <div className="flex flex-wrap gap-1.5">
                            {school.types.map(t => (
                                <span key={t} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100 uppercase">
                                    {t}
                                </span>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <Hash className="h-3 w-3" /> INEP
                                </p>
                                <p className="text-xs font-mono font-bold text-slate-700">{school.inep || 'N/A'}</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <Navigation className="h-3 w-3" /> Latitude/Long
                                </p>
                                <p className="text-xs font-bold text-slate-700 truncate">{school.lat.toFixed(4)}, {school.lng.toFixed(4)}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleEnrollClick}
                            disabled={availablePercent < 1}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                        >
                            Solicitar Matrícula <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {!isExpanded && (
                    <div className="mt-auto pt-4 flex items-center justify-center text-[10px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                        <ChevronDown className="h-3 w-3 mr-1" /> Mais Informações
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Edit Modal Component ---
const EditSchoolModal: React.FC<{ 
    school: School; 
    onClose: () => void; 
    onSave: (updated: School) => Promise<void> 
}> = ({ school, onClose, onSave }) => {
    const [formData, setFormData] = useState<School>({ ...school });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <SchoolIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-slate-800">Editar Unidade Escolar</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Escola</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Endereço Completo</label>
                            <input 
                                type="text" 
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Código INEP</label>
                                <input 
                                    type="text" 
                                    value={formData.inep || ''}
                                    onChange={e => setFormData({ ...formData, inep: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capacidade (Vagas)</label>
                                <input 
                                    type="number" 
                                    required
                                    value={formData.availableSlots}
                                    onChange={e => setFormData({ ...formData, availableSlots: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            <label className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-blue-50 transition">
                                <input 
                                    type="checkbox" 
                                    checked={formData.hasAEE}
                                    onChange={e => setFormData({ ...formData, hasAEE: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <span className="text-xs font-bold text-slate-700 uppercase">Atendimento Especializado (AEE)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const SchoolList: React.FC = () => {
  const { schools, students, updateSchools } = useData();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showAEE, setShowAEE] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [expandedSchoolId, setExpandedSchoolId] = useState<string | null>(null);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem('admin_auth') === 'true');
  }, []);

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
    markersLayerRef.current.clearLayers();

    filteredSchools.forEach(school => {
        const enrolled = getEnrolled(school.name);
        const total = school.availableSlots || 0;
        const availablePercent = total > 0 ? ((total - enrolled) / total) * 100 : 0;
        
        // Cores conforme disponibilidade:
        // Verde (>50%), Amarelo (10-50%), Vermelho (<10%)
        const color = availablePercent < 10 ? '#ef4444' : availablePercent <= 50 ? '#eab308' : '#22c55e';

        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin" style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; position: relative;">
                     <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
                   </div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const marker = L.marker([school.lat, school.lng], { icon })
            .bindPopup(`
                <div class="text-center p-1 font-sans">
                    <h4 class="font-bold text-slate-800 text-sm mb-1">${school.name}</h4>
                    <p class="text-[10px] text-slate-500 uppercase font-bold mb-2">${availablePercent.toFixed(0)}% vagas disponíveis</p>
                    <div class="flex items-center justify-center gap-1.5 mb-2">
                        <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}"></div>
                        <span class="text-[10px] font-bold" style="color: ${color}">${availablePercent < 10 ? 'LOTAÇÃO CRÍTICA' : availablePercent <= 50 ? 'VAGAS MÉDIAS' : 'ALTA DISPONIBILIDADE'}</span>
                    </div>
                </div>
            `, { closeButton: false });
        
        marker.addTo(markersLayerRef.current);
    });
  }, [filteredSchools, getEnrolled]);

  useEffect(() => {
    if (viewMode === 'map' && !mapRef.current) {
        const map = L.map('main-map', { 
            attributionControl: false, 
            zoomControl: true,
            maxZoom: 18,
            minZoom: 11
        }).setView([-12.5253, -40.2917], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        markersLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
    }
    
    if (viewMode === 'map') {
        const timer = setTimeout(() => { 
            if (mapRef.current) {
                mapRef.current.invalidateSize(); 
                updateMarkers(); 
            }
        }, 150);
        return () => clearTimeout(timer);
    }
  }, [viewMode, updateMarkers]);

  useEffect(() => {
      if (viewMode === 'map' && mapRef.current) {
          updateMarkers();
      }
  }, [filteredSchools, viewMode, updateMarkers]);

  const handleSaveSchoolEdit = async (updated: School) => {
    const newSchools = schools.map(s => s.id === updated.id ? updated : s);
    try {
        await updateSchools(newSchools);
        addToast('Escola atualizada com sucesso!', 'success');
    } catch (e) {
        addToast('Erro ao atualizar escola.', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setShowAEE(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Guia de Escolas Municipais</h1>
            <p className="text-slate-600 mt-2">Explore as unidades, confira vagas e localize o AEE mais próximo.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex -space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white"></div>
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div>
             </div>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{filteredSchools.length} Resultados</span>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 mb-8 sticky top-20 z-[40] flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
                type="text" 
                placeholder="Pesquisar unidade escolar..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 border border-slate-100 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium" 
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative">
                <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)} 
                    className="px-4 py-3 border border-slate-100 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none appearance-none pr-10 min-w-[180px] cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <option value="">Todas as Etapas</option>
                    {Object.values(SchoolType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            
            <button 
                onClick={() => setShowAEE(!showAEE)} 
                className={`px-4 py-3 rounded-2xl border font-bold flex items-center gap-2 transition-all whitespace-nowrap shadow-sm ${showAEE ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
            >
                <HeartPulse className={`h-5 w-5 ${showAEE ? 'animate-pulse' : ''}`} /> 
                AEE
            </button>

            <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200 shadow-inner">
                <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Lista"><LayoutList className="h-5 w-5" /></button>
                <button onClick={() => setViewMode('map')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'map' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} title="Mapa"><MapIcon className="h-5 w-5" /></button>
            </div>
          </div>
        </div>

        {/* Legends for availability */}
        <div className="mb-6 flex flex-wrap gap-4 px-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div> &gt;50% Vagas Livres
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div> 10-50% Vagas Livres
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div> &lt;10% Vagas Livres
            </div>
        </div>

        {viewMode === 'list' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {filteredSchools.map(s => (
                    <SchoolCard 
                        key={s.id} 
                        school={s} 
                        enrolledCount={getEnrolled(s.name)} 
                        isExpanded={expandedSchoolId === s.id}
                        onToggleExpand={() => setExpandedSchoolId(expandedSchoolId === s.id ? null : s.id)}
                        onEdit={setEditingSchool}
                        isAdmin={isAdmin}
                    />
                ))}
                {filteredSchools.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                        <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200/50 rotate-12">
                            <Search className="h-10 w-10 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Nenhuma escola corresponde aos filtros</h3>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">Tente redefinir os filtros ou buscar por outro nome de bairro ou escola.</p>
                        <button onClick={handleResetFilters} className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">Resetar Filtros</button>
                    </div>
                )}
            </div>
        ) : (
            <div className="relative animate-in zoom-in-95 duration-500">
                <div id="main-map" className="h-[650px] w-full rounded-[40px] border-4 border-white shadow-2xl z-10 overflow-hidden" />
                <div className="absolute top-6 left-6 z-[400] bg-white/95 backdrop-blur-md px-5 py-4 rounded-3xl shadow-2xl border border-slate-100 pointer-events-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                       <Navigation className="h-3 w-3 text-blue-600" /> Localizador Dinâmico
                    </p>
                    <p className="text-xs text-slate-700 font-bold">Exibindo localizações em tempo real</p>
                </div>
            </div>
        )}
      </div>

      {/* Modal de Edição */}
      {editingSchool && (
          <EditSchoolModal 
            school={editingSchool} 
            onClose={() => setEditingSchool(null)} 
            onSave={handleSaveSchoolEdit} 
          />
      )}

      <style>{`
        @keyframes markerBounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
        .custom-marker {
            animation: markerBounce 2s infinite ease-in-out;
        }
        .leaflet-popup-content-wrapper {
            border-radius: 24px !important;
            padding: 12px !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
            border: 1px solid #f1f5f9;
        }
        .leaflet-popup-tip {
            box-shadow: none !important;
        }
      `}</style>
    </div>
  );
};