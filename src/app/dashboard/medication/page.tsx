'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Cat {
  id: string;
  name: string;
  breed: string;
  age: number;
}

interface MedicationRecord {
  id: string;
  catId: string;
  cat: Cat;
  medicationName: string;
  dosage: string;
  frequency: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: string;
}

export default function MedicationDashboard() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [medicationRecords, setMedicationRecords] = useState<MedicationRecord[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    catId: '',
    medicationName: '',
    dosage: '',
    frequency: '每日',
    morning: false,
    afternoon: false,
    evening: false,
    night: false,
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchCats();
    fetchMedicationRecords();
  }, []);

  const fetchCats = async () => {
    try {
      const response = await fetch('/api/cats');
      if (response.ok) {
        const data = await response.json();
        setCats(data.cats || []);
      }
    } catch (error) {
      console.error('獲取貓咪列表失敗:', error);
      setCats([]);
    }
  };

  const fetchMedicationRecords = async () => {
    try {
      const response = await fetch('/api/medication-management');
      if (response.ok) {
        const data = await response.json();
        setMedicationRecords(data || []);
      }
    } catch (error) {
      console.error('獲取用藥記錄失敗:', error);
      setMedicationRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.catId || !formData.medicationName || !formData.startDate || !formData.endDate) {
      alert('請填寫所有必填欄位');
      return;
    }

    try {
      const response = await fetch('/api/medication-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('用藥記錄新增成功！');
        setFormData({
          catId: '',
          medicationName: '',
          dosage: '',
          frequency: '每日',
          morning: false,
          afternoon: false,
          evening: false,
          night: false,
          startDate: '',
          endDate: '',
          notes: ''
        });
        setShowForm(false);
        fetchMedicationRecords();
      } else {
        alert('新增失敗，請稍後再試');
      }
    } catch (error) {
      console.error('新增用藥記錄錯誤:', error);
      alert('新增失敗，請檢查網路連線');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除這筆用藥記錄嗎？')) {
      try {
        const response = await fetch(`/api/medication-management/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchMedicationRecords();
        }
      } catch (error) {
        console.error('刪除失敗:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const getFrequencyText = (record: MedicationRecord) => {
    const times = [];
    if (record.morning) times.push('早上');
    if (record.afternoon) times.push('下午');
    if (record.evening) times.push('晚上');
    if (record.night) times.push('睡前');
    return times.join('、');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">用藥管理主控台</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? '取消' : '新增用藥記錄'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">新增用藥記錄</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    選擇貓咪 *
                  </label>
                  <select
                    value={formData.catId}
                    onChange={(e) => setFormData({...formData, catId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">請選擇貓咪</option>
                    {cats.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    藥物名稱 *
                  </label>
                  <input
                    type="text"
                    value={formData.medicationName}
                    onChange={(e) => setFormData({...formData, medicationName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：抗生素、維生素"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    劑量
                  </label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：1ml、1/2顆"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用藥頻率
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="每日">每日</option>
                    <option value="隔日">隔日</option>
                    <option value="每週">每週</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    開始日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    到期日期 *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用藥時間
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.morning}
                      onChange={(e) => setFormData({...formData, morning: e.target.checked})}
                      className="mr-2"
                    />
                    早上
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.afternoon}
                      onChange={(e) => setFormData({...formData, afternoon: e.target.checked})}
                      className="mr-2"
                    />
                    下午
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.evening}
                      onChange={(e) => setFormData({...formData, evening: e.target.checked})}
                      className="mr-2"
                    />
                    晚上
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.night}
                      onChange={(e) => setFormData({...formData, night: e.target.checked})}
                      className="mr-2"
                    />
                    睡前
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  備註
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="其他注意事項..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  新增記錄
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">用藥記錄列表</h2>
          
          {medicationRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">尚無用藥記錄</p>
              <p className="text-sm mt-2">點擊上方「新增用藥記錄」開始管理貓咪的用藥</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">貓咪</th>
                    <th className="px-4 py-2 text-left">藥物名稱</th>
                    <th className="px-4 py-2 text-left">劑量</th>
                    <th className="px-4 py-2 text-left">用藥時間</th>
                    <th className="px-4 py-2 text-left">開始日期</th>
                    <th className="px-4 py-2 text-left">到期日期</th>
                    <th className="px-4 py-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {medicationRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{record.cat.name}</td>
                      <td className="px-4 py-2">{record.medicationName}</td>
                      <td className="px-4 py-2">{record.dosage}</td>
                      <td className="px-4 py-2">
                        <span className="text-sm text-gray-600">
                          {getFrequencyText(record)}
                        </span>
                      </td>
                      <td className="px-4 py-2">{formatDate(record.startDate)}</td>
                      <td className="px-4 py-2">{formatDate(record.endDate)}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}