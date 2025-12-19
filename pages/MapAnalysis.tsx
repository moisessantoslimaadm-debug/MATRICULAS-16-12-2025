import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNavigate } from '../router';
import { 
  ArrowLeft, LocateFixed, Activity, Maximize, 
  School as SchoolIcon, Users, Map as MapIcon, 
  Layers, Filter, MapPin, Info
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
  const studentMarkersRef = useRef<any>(null);

  const [activeLayer, setActiveLayer] = useState<'heat' | 'points'>('heat');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) {
        const map = L.map('analysis-map', {
            attributionControl: false,
            zoomControl: false,
            maxZoom: 18,
            minZoom: 12
        }).setView([-12.5253, -40.2917], 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

        schoolMarkersRef.current = L.layerGroup().addTo(map);
        studentMarkersRef.current = L.layerGroup(); // Não adiciona ao mapa por padrão
        mapRef.current = map;
        setIsMapReady(true);
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  // Sincronização de Pontos e Calor
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    
    // Limpeza
    if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
    }
    schoolMarkersRef.current.clearLayers();
    studentMarkersRef.current.clearLayers();

    // 1. Sempre renderiza Escolas (Markers fixos)
    schools.forEach(school => {
        if (!school.lat || !school.lng) return;
        const icon = L.divIcon({
            html: `<div class="bg-blue-700 p-2 rounded-lg shadow-lg border-2 border-white text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                   </div>`,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
        L.marker([school.lat, school.lng], { icon })
          .bindPopup(`<b class="text-sm">${school.name}</b><br/><span class="text-xs text-slate-500">${school.address}</span>`)
          .addTo(schoolMarkersRef.current);
    });

    // 2. Lógica da Camada Ativa (Calor vs Pontos Individuais)
    const validStudents = students.filter(s => s.lat && s.lng);

    if (activeLayer === 'heat') {
        const heatData = validStudents.map(s => [s.lat, s.lng, 0.8]); // Intensidade 0.8
        if (typeof L.heatLayer === 'function' && heatData.length > 0) {
            heatLayerRef.current = L.heatLayer(heatData, {
                radius: 45,
                blur: 25,
                maxZoom: 17,
                gradient: { 0.4: '#3b82f6', 0.65: '#10b981', 0.8: '#facc15', 1: '#ef4444' }
            }).addTo(mapRef.current);
        }
    } else {
        // Camada de Pontos Individuais (Logradouros)
        validStudents.forEach(s => {
            const dot = L.circleMarker([s.lat, s.lng], {
                radius: 5,
                fillColor: '#2563eb',
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
            dot.bindPopup(`
                <div class="p-2">
                    <p class="font-bold text-slate-900 text-xs uppercase">${s.name}</p>
                    <p class="text-[10px] text-slate-500 mt-1">${s.address?.street || 'Rua não informada'}, ${s.address?.number || 'S/N'}</p>
                    <p class="text-[9px] font-bold text-blue-600 uppercase mt-1">${s.address?.neighborhood || 'Bairro Indefinido'}</p>
                </div>
            `);
            dot.addTo(studentMarkersRef.current);
        });
        studentMarkersRef.current.addTo(mapRef.current);
    }
  }, [activeLayer, students, schools, isMapReady]);

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 flex overflow-hidden page-transition">
      <div className="w-[380px] bg-white border-r border-slate-200 shadow-xl z-20 flex flex-col">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <button onClick={() => navigate('/dashboard')} className="mb-6 text-slate-400 hover:text-blue-600 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider transition">
                <ArrowLeft className="h-3 w-3" /> Voltar ao Painel
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <LocateFixed className="h-6 w-6 text-blue-600" /> Geoprocessamento
            </h1>
            <p className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">Análise de Demanda Nominal</p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <section>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Camadas de Visualização
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    <button 
                        onClick={() => setActiveLayer('heat')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${activeLayer === 'heat' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Activity className="h-5 w-5" />
                        <div className="text-left">
                            <p className="text-xs font-bold">Mapa de Calor</p>
                            <p className="text-[9px] opacity-70">Densidade de Alunos</p>
                        </div>
                    </button>
                    <button 
                        onClick={() => setActiveLayer('points')}
                        className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${activeLayer === 'points' ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <MapPin className="h-5 w-5" />
                        <div className="text-left">
                            <p className="text-xs font-bold">Logradouros</p>
                            <p className="text-[9px] opacity-70">Pontos Individuais</p>
                        </div>
                    </button>
                </div>
            </section>

            <section className="bg-slate-900 rounded-2xl p-6 text-white">
                {/* Fixed missing Info import in the icons list and used it here */}
                <h3 className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Info className="h-3 w-3" /> Resumo da Rede
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Alunos Mapeados</span>
                        <span className="text-xl font-black">{students.length}</span>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Unidades de Ensino</span>
                        <span className="text-xl font-black">{schools.length}</span>
                    </div>
                </div>
            </section>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-[9px] font-bold text-blue-600 uppercase mb-4">Legenda de Calor</p>
                <div className="flex items-center gap-1 h-2 w-full rounded-full overflow-hidden mb-2">
                    <div className="flex-1 bg-blue-500"></div>
                    <div className="flex-1 bg-emerald-500"></div>
                    <div className="flex-1 bg-yellow-500"></div>
                    <div className="flex-1 bg-red-500"></div>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                    <span>Baixa</span>
                    <span>Saturação</span>
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <div id="analysis-map" className="w-full h-full z-10" />
        <div className="absolute top-6 left-6 z-[300] bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-xl border border-white flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Maximize className="h-4 w-4" /></div>
            <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Monitoramento SME</span>
                <span className="text-sm font-black text-slate-900 uppercase">Itaberaba Digital</span>
            </div>
        </div>
      </div>
    </div>
  );
};