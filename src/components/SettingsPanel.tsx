import { useEffect, useState } from 'react';
import type { CentralSettings, EquipmentState, LocationProfile } from '../types';
import EquipmentManager from './EquipmentManager';
import CentralSettingsPanel from './CentralSettingsPanel';
import LocationsHorizonManager from './LocationsHorizonManager';
import InfoPanel from './InfoPanel';
import { loadJson, saveJson, STORAGE_KEYS } from '../lib/storage';

type SettingsTab = 'equipment' | 'central' | 'locations' | 'info';

type Props = {
  equipment: EquipmentState;
  onEquipmentChange: (equipment: EquipmentState) => void;
  settings: CentralSettings;
  onSettingsChange: (settings: CentralSettings) => void;
  locations: LocationProfile[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  onAddLocation: (location: LocationProfile) => void;
  onDeleteLocation: (id: string) => void;
  onUpdateLocation: (location: LocationProfile) => void;
};

export default function SettingsPanel(props: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => loadJson<SettingsTab>(STORAGE_KEYS.settingsTab, 'equipment'));
  useEffect(() => saveJson(STORAGE_KEYS.settingsTab, activeTab), [activeTab]);
  return (
    <div className="settings-page">
      <nav className="settings-tabs" aria-label="Einstellungsbereiche">
        <button type="button" className={activeTab === 'equipment' ? 'active' : ''} onClick={() => setActiveTab('equipment')}>Ausrüstung</button>
        <button type="button" className={activeTab === 'central' ? 'active' : ''} onClick={() => setActiveTab('central')}>Zentrale Einstellungen</button>
        <button type="button" className={activeTab === 'locations' ? 'active' : ''} onClick={() => setActiveTab('locations')}>Standorte &amp; Horizont</button>
        <button type="button" className={activeTab === 'info' ? 'active' : ''} onClick={() => setActiveTab('info')}>Info</button>
      </nav>
      <div hidden={activeTab !== 'equipment'}><EquipmentManager equipment={props.equipment} onChange={props.onEquipmentChange} /></div>
      <div hidden={activeTab !== 'central'}><CentralSettingsPanel settings={props.settings} onChange={props.onSettingsChange} /></div>
      <div hidden={activeTab !== 'locations'}>
        <LocationsHorizonManager
          locations={props.locations}
          selectedId={props.selectedLocationId}
          onSelect={props.onSelectLocation}
          onAdd={props.onAddLocation}
          onDelete={props.onDeleteLocation}
          onUpdate={props.onUpdateLocation}
          settings={props.settings}
          onSettingsChange={props.onSettingsChange}
        />
      </div>
      <div hidden={activeTab !== 'info'}><InfoPanel /></div>
    </div>
  );
}
