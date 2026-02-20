import { useEffect, useState } from "react";
import ConfigService from "../../services/config/configService";

const ConfigManagement = () => {

  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await ConfigService.listConfigs();
      setConfigs(res.data);
    } catch {
      alert("Failed to load configs");
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key, value) => {
    try {
      await ConfigService.updateConfig(key, { configValue: value });
      alert("Updated successfully");
      fetchConfigs();
    } catch {
      alert("Update failed");
    }
  };

  const createConfig = async (key, value) => {
    try {
      await ConfigService.createConfig({
        configKey: key,
        configValue: value
      });
      alert("Config added successfully");
      setShowAdd(false);
      fetchConfigs();
    } catch {
      alert("Failed to add config (maybe duplicate key)");
    }
  };

  if (loading) return <p>Loading configs...</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">System Configurations</h2>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Config
        </button>
      </div>

      {showAdd && (
        <AddConfigForm
          onCancel={() => setShowAdd(false)}
          onSave={createConfig}
        />
      )}

      <div className="bg-white p-4 rounded shadow">
        {configs.map(config => (
          <ConfigRow
            key={config.configKey}
            config={config}
            onUpdate={updateConfig}
          />
        ))}
      </div>
    </div>
  );
};

const ConfigRow = ({ config, onUpdate }) => {

  const [value, setValue] = useState(config.configValue);

  return (
    <div className="py-3 flex justify-between items-center">

      <div>
        <p className="font-semibold">{config.configKey}</p>
      </div>

      <div className="flex gap-2">
        <input
          className="border-2 rounded p-1"
          value={value}
          onChange={e => setValue(e.target.value)}
        />

        <button
          onClick={() => onUpdate(config.configKey, value)}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Update
        </button>
      </div>
    </div>
  );
};

const AddConfigForm = ({ onCancel, onSave }) => {

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className="bg-gray-100 p-4 rounded mb-4">

      <h3 className="font-semibold mb-2">Add New Config</h3>

      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Config Key"
        onChange={e => setKey(e.target.value)}
      />

      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Config Value"
        onChange={e => setValue(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={() => onSave(key, value)}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfigManagement;