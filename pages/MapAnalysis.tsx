import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  Navigation, Crosshair, School as SchoolIcon, 
  ArrowLeft, LocateFixed, Activity, Maximize, TrendingUp, Info, Users,
  Map as MapIcon, Layers, Filter, Compass
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

declare const L: any;

export const MapAnalysis: React.FC = () => {
  const { schools, students } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const mapRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);
  const schoolMarkersRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<'heat' | 'markers'>('heat');
  const [selectedPoint, setSelectedPoint] = useState<{lat: number, lng: number} | null>(null);
  const [nearestSchool, setNearestSchool] = useState<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 18,
            minZoom: 10
        }).setView([-12.5253, -40.2917], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        schoolMarkersRef.current = L.layerGroup().addTo(map);
        routeLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        map.on('click', (e: any) => {
            if (e.latlng && typeof e.latlng.lat === 'number') {
                handleMapClick(e.latlng.lat, e.latlng.lng);
            }
        });
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPoint({ lat, lng });
    if (routeLayerRef.current) {
        routeLayerRef.current.clearLayers();
    }

    let minDistance = Infinity;
    let closest = null;

    const validSchools = (schools || []).filter(s => s && typeof s.lat === 'number' && typeof s.lng === 'number');

    validSchools.forEach(school => {
        const dist = calculateDistance(lat, lng, school.lat, school.lng);
        if (dist < minDistance) {
            minDistance = dist;
            closest = { ...school, distance: dist };
        }
    });

    if (closest && routeLayerRef.current) {
        setNearestSchool(closest);
        L.polyline([[lat, lng], [(closest as any).lat, (closest as any).lng]], {
            color: '#4F46E5', weight: 4, dashArray: '12, 12', opacity: 0.7
        }).addTo(routeLayerRef.current);

        const userIcon = L.divIcon({
            html: `<div class="w-6 h-6 bg-indigo-600 border-[3px] border-white rounded-full animate-pulse shadow-2xl scale-125"></div>`,
            className: 'custom-div-icon'
        });
        L.marker([lat, lng], { icon: userIcon }).addTo(routeLayerRef.current);
        addToast(`Unidade recomendada a ${minDistance.toFixed(2)}km`, 'info');
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Limpeza rigorosa antes de alternar camadas
    if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
    }
    
    if (schoolMarkersRef.current) {
        schoolMarkersRef.current.clearLayers();
    }

    if (activeLayer === 'heat') {
        const heatData = (students || [])
            .filter(s => s && typeof s.lat === 'number' && typeof s.lng === 'number')
            .map(s => [s.lat, s.lng, 1.0]); // Intensidade máxima por ponto

        if (heatData.length > 0) {
            // Verifica se o plugin está disponível no objeto L global
            if (typeof L.heatLayer === 'function') {
                heatLayerRef.current = L.heatLayer(heatData, {
                    radius: 35,
                    blur: 20,
                    maxZoom: 17,
                    minOpacity: 0.4,
                    gradient: { 0.4: '#3b82f6', 0.6: '#10b981', 0.8: '#facc15', 1: '#ef4444' }
                }).addTo(mapRef.current);
            } else {
                console.warn("Plugin Leaflet.heat não detectado. Verifique o script no index.html.");
                addToast("Erro ao carregar mapa de calor.", "error");
            }
        }
    }

    if (activeLayer === 'markers' && schoolMarkersRef.current) {
        (schools || []).forEach(school => {
            if (!school || typeof school.lat !== 'number' || typeof school.lng !== 'number') return;

            const icon = L.divIcon({
                html: `<div class="bg-indigo-600 p-3 rounded-2xl shadow-2xl border-2 border-white text-white transform hover:scale-125 transition-all duration-300 animate-float">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                       </div>`,
                className: 'custom-div-icon',
                iconSize: [44, 44],
                iconAnchor: [22, 22]
            });

            L.marker([school.lat, school.lng], { icon })
                .bindPopup(`
                    <div class="p-5 min-w-[220px]">
                        <h4 class="font-black text-slate-900 text-lg leading-tight mb-2">${school.name}</h4>
                        <p class="text-xs text-slate-500 mb-5 font-medium">${school.address}</p>
                        <div class="flex items-center gap-3 bg-indigo-50 p-3 rounded-2xl text-indigo-600 border border-indigo-100">
                            <Users class="h-4 w-4" />
                            <span class="text-[10px] font-black uppercase tracking-widest">Vagas: ${school.availableSlots}</span>
                        </div>
                    </div>
                `)
                .addTo(schoolMarkersRef.current);
        });
    }
  }, [activeLayer, schools, students]);

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 flex overflow-hidden page-transition">
      
      {/* Sidebar de Gestão de Mapa */}
      <div className="w-[450px] bg-white border-r border-slate-200 shadow-2xl z-20 flex flex-col animate-in slide-in-from-left-4 duration-700">
        <div className="p-12 border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => navigate('/dashboard')} className="mb-10 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition">
                <ArrowLeft className="h-4 w-4" /> Dashboard de Gestão
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                <LocateFixed className="h-12 w-12 text-indigo-600" /> Geoprocess
            </h1>
            <p className="text-[10px] text-slate-400 mt-4 uppercase font-black tracking-[0.4em]">SME • Inteligência de Dados Geográficos</p>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12">
            <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Layers className="h-4 w-4" /> Camadas de Análise Macro
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <button 
                        onClick={() => setActiveLayer('heat')}
                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-5 ${activeLayer === 'heat' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Activity className="h-10 w-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Densidade</span>
                    </button>
                    <button 
                        onClick={() => setActiveLayer('markers')}
                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-5 ${activeLayer === 'markers' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <SchoolIcon className="h-10 w-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unidades</span>
                    </button>
                </div>
            </section>

            <section className="bg-[#0F172A] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 opacity-10 rounded-full -mr-20 -mt-20 transition-transform group-hover:scale-150"></div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3 relative z-10">
                    <Compass className="h-4 w-4" /> Radar de Vagas
                </h3>
                {selectedPoint ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-top-6 relative z-10">
                        <div className="flex justify-between items-end">
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unidade Identificada</p>
                                <p className="font-black text-3xl leading-tight mt-3 truncate">{nearestSchool?.name || 'Localizando...'}</p>
                            </div>
                            <span className="text-2xl font-black text-emerald-400 ml-6 shrink-0">
                                {nearestSchool?.distance ? `${nearestSchool.distance.toFixed(2)}km` : '-'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">{nearestSchool?.address || '-'}</p>
                        <button 
                            onClick={() => navigate('/registration')}
                            className="w-full py-6 bg-indigo-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition shadow-2xl shadow-indigo-900/50 active:scale-95"
                        >
                            Confirmar Georeferência
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-16 opacity-30">
                        <Crosshair className="h-16 w-16 mx-auto mb-8 text-indigo-400 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Interaja com o mapa para análise</p>
                    </div>
                )}
            </section>

            <div className="bg-indigo-50 p-10 rounded-[3rem] border border-indigo-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-3 w-3 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Legenda de Calor</span>
                </div>
                <div className="flex items-center gap-1.5 h-4 w-full rounded-full overflow-hidden mb-4">
                    <div className="flex-1 bg-blue-500 h-full"></div>
                    <div className="flex-1 bg-emerald-500 h-full"></div>
                    <div className="flex-1 bg-yellow-500 h-full"></div>
                    <div className="flex-1 bg-red-500 h-full"></div>
                </div>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span>Baixa Demanda</span>
                    <span>Alta Densidade</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div id="analysis-map" className="w-full h-full z-10" />
        
        {/* Floating Tooltips */}
        <div className="absolute top-12 left-12 z-[300] bg-white/95 backdrop-blur-2xl px-8 py-6 rounded-[2.5rem] shadow-2xl border border-white flex items-center gap-6 animate-in slide-in-from-top-6 duration-1000">
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-100 animate-float"><Maximize className="h-6 w-6" /></div>
            <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Status do Geoprocess</span>
                <span className="text-lg font-black text-slate-900">Rede Municipal • Tempo Real</span>
            </div>
        </div>

        <div className="absolute bottom-12 right-12 z-[300] flex flex-col gap-3">
             <button className="bg-white p-4 rounded-2xl shadow-xl hover:bg-slate-50 transition border border-slate-100 text-slate-600"><MapIcon className="h-5 w-5" /></button>
             <button className="bg-white p-4 rounded-2xl shadow-xl hover:bg-slate-50 transition border border-slate-100 text-slate-600"><Filter className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};