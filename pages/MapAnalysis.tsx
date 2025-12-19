
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

  const [activeLayer, setActiveLayer] = useState<'heat' | 'markers'>('heat');

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 18,
            minZoom: 10
        }).setView([-12.5253, -40.2917], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        schoolMarkersRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    
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
            .map(s => [s.lat, s.lng, 1.0]); 

        if (heatData.length > 0) {
            if (typeof L.heatLayer === 'function') {
                heatLayerRef.current = L.heatLayer(heatData, {
                    radius: 40,
                    blur: 25,
                    maxZoom: 17,
                    minOpacity: 0.5,
                    gradient: { 0.4: '#3b82f6', 0.6: '#10b981', 0.8: '#facc15', 1: '#ef4444' }
                }).addTo(mapRef.current);
            } else {
                addToast("Erro ao inicializar sensor de calor.", "error");
            }
        }
    }

    if (activeLayer === 'markers' && schoolMarkersRef.current) {
        (schools || []).forEach(school => {
            const icon = L.divIcon({
                html: `<div class="bg-indigo-600 p-3 rounded-2xl shadow-2xl border-2 border-white text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                       </div>`,
                className: 'custom-div-icon',
                iconSize: [44, 44],
                iconAnchor: [22, 22]
            });

            L.marker([school.lat, school.lng], { icon }).addTo(schoolMarkersRef.current);
        });
    }
  }, [activeLayer, schools, students]);

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 flex overflow-hidden page-transition">
      <div className="w-[450px] bg-white border-r border-slate-200 shadow-2xl z-20 flex flex-col animate-in slide-in-from-left-4 duration-700">
        <div className="p-12 border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => navigate('/dashboard')} className="mb-10 text-slate-400 hover:text-indigo-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition">
                <ArrowLeft className="h-4 w-4" /> Dashboard de Gestão
            </button>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
                <LocateFixed className="h-12 w-12 text-indigo-600" /> Geoprocess
            </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12">
            <section>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <Layers className="h-4 w-4" /> Camadas de Análise Macro
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <button 
                        onClick={() => setActiveLayer('heat')}
                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-5 ${activeLayer === 'heat' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                        <Activity className="h-10 w-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Densidade</span>
                    </button>
                    <button 
                        onClick={() => setActiveLayer('markers')}
                        className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-5 ${activeLayer === 'markers' ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                        <SchoolIcon className="h-10 w-10" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unidades</span>
                    </button>
                </div>
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
        <div className="absolute top-12 left-12 z-[300] bg-white/95 backdrop-blur-2xl px-8 py-6 rounded-[2.5rem] shadow-2xl border border-white flex items-center gap-6 animate-in slide-in-from-top-6 duration-1000">
            <div className="bg-indigo-600 p-4 rounded-3xl text-white shadow-xl shadow-indigo-100 animate-float"><Maximize className="h-6 w-6" /></div>
            <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">Status do Geoprocess</span>
                <span className="text-lg font-black text-slate-900">Análise Macro • Itaberaba Digital</span>
            </div>
        </div>
      </div>
    </div>
  );
};
