
import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  Navigation, Crosshair, School as SchoolIcon, 
  ArrowLeft, LocateFixed, Activity, Maximize, TrendingUp, Info, Users
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
            zoomControl: false
        }).setView([-12.5253, -40.2917], 15);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        schoolMarkersRef.current = L.layerGroup().addTo(map);
        routeLayerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        map.on('click', (e: any) => {
            if (e.latlng) {
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

    // Filter out potential null schools to avoid crash
    const validSchools = (schools || []).filter(s => s && s.lat != null && s.lng != null);

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
            html: `<div class="w-5 h-5 bg-indigo-600 border-[3px] border-white rounded-full animate-pulse shadow-2xl"></div>`,
            className: 'custom-div-icon'
        });
        L.marker([lat, lng], { icon: userIcon }).addTo(routeLayerRef.current);
        addToast(`Escola a ${minDistance.toFixed(2)}km`, 'info');
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Clean up existing heat layer if it exists
    if (heatLayerRef.current && mapRef.current.hasLayer(heatLayerRef.current)) {
        mapRef.current.removeLayer(heatLayerRef.current);
    }
    
    if (schoolMarkersRef.current) {
        schoolMarkersRef.current.clearLayers();
    }

    if (activeLayer === 'heat') {
        // Defensive check: filter out null students or students without coordinates
        const heatData = (students || [])
            .filter(s => s && s.lat != null && s.lng != null)
            .map(s => [s.lat, s.lng, 0.8]);

        if ((L as any).heatLayer) {
            heatLayerRef.current = (L as any).heatLayer(heatData, {
                radius: 35, blur: 20, maxZoom: 17,
                gradient: { 0.4: '#3b82f6', 0.65: '#22c55e', 1: '#ef4444' }
            }).addTo(mapRef.current);
        }
    }

    if (activeLayer === 'markers' && schoolMarkersRef.current) {
        (schools || []).forEach(school => {
            // Defensive check: ensure school and coordinates exist
            if (!school || school.lat == null || school.lng == null) return;

            const icon = L.divIcon({
                html: `<div class="bg-indigo-600 p-2.5 rounded-2xl shadow-2xl border-2 border-white text-white transform hover:scale-125 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                       </div>`,
                className: 'custom-div-icon',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });

            L.marker([school.lat, school.lng], { icon })
                .bindPopup(`
                    <div class="p-4 min-w-[200px]">
                        <h4 class="font-black text-slate-900 text-lg leading-tight mb-2">${school.name}</h4>
                        <p class="text-xs text-slate-500 mb-4">${school.address}</p>
                        <div class="flex items-center gap-2 bg-indigo-50 p-2 rounded-xl text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            <span class="text-xs font-black uppercase">Vagas: ${school.availableSlots}</span>
                        </div>
                    </div>
                `)
                .addTo(schoolMarkersRef.current);
        });
    }
  }, [activeLayer, schools, students]);

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 flex overflow-hidden font-sans">
      
      <div className="w-[400px] bg-white border-r border-slate-200 shadow-2xl z-20 flex flex-col animate-in slide-in-from-left-4 duration-700">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => navigate('/dashboard')} className="mb-6 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition">
                <ArrowLeft className="h-4 w-4" /> Painel Central
            </button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                <LocateFixed className="h-9 w-9 text-indigo-600" /> Geoprocess
            </h1>
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-[0.3em]">Rede Municipal de Itaberaba</p>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
            <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Modos de Visualização
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setActiveLayer('heat')}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${activeLayer === 'heat' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <Activity className="h-7 w-7" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Densidade</span>
                    </button>
                    <button 
                        onClick={() => setActiveLayer('markers')}
                        className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${activeLayer === 'markers' ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'}`}
                    >
                        <SchoolIcon className="h-7 w-7" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unidades</span>
                    </button>
                </div>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                    <Navigation className="h-4 w-4" /> Radar de Vagas
                </h3>
                {selectedPoint ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 relative z-10">
                        <div className="flex justify-between items-end">
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-500 uppercase">Escola Selecionada</p>
                                <p className="font-black text-2xl leading-tight mt-1 truncate">{nearestSchool?.name || 'Localizando...'}</p>
                            </div>
                            <span className="text-xl font-black text-emerald-400 ml-4 shrink-0">
                                {nearestSchool?.distance ? `${nearestSchool.distance.toFixed(2)}km` : '-'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 font-medium line-clamp-2">{nearestSchool?.address || '-'}</p>
                        <button 
                            onClick={() => navigate('/registration')}
                            className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-900"
                        >
                            Efetuar Matrícula
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10 opacity-40">
                        <Crosshair className="h-12 w-12 mx-auto mb-4 text-indigo-400 animate-pulse" />
                        <p className="text-xs font-black uppercase tracking-widest">Selecione um ponto no mapa</p>
                    </div>
                )}
            </section>

            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase">Legenda de Calor</span>
                </div>
                <div className="flex items-center gap-1 h-3 w-full rounded-full overflow-hidden mb-2">
                    <div className="flex-1 bg-blue-500 h-full"></div>
                    <div className="flex-1 bg-emerald-500 h-full"></div>
                    <div className="flex-1 bg-red-500 h-full"></div>
                </div>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Baixa Demanda</span>
                    <span>Crítico</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div id="analysis-map" className="w-full h-full z-10" />
        <div className="absolute top-8 left-8 z-[300] bg-white/90 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] shadow-2xl border border-white flex items-center gap-4 animate-in slide-in-from-top-4 duration-1000">
            <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg"><Maximize className="h-5 w-5" /></div>
            <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Modo de Análise</span>
                <span className="text-sm font-black text-slate-900">Itaberaba • Visão Macro</span>
            </div>
        </div>
      </div>
    </div>
  );
};
