
import React, { useState } from 'react';
import { 
  MessageSquare, Users, FileText, Phone, Video, 
  Paperclip, Send, Bell, Search, MoreVertical, 
  Plus, X, Hash, User, Shield
} from 'lucide-react';
import { ChatChannel, ChatMessage, CrisisRoom } from '../types';

interface CoordinationCenterProps {
  onBack: () => void;
}

const MOCK_CHANNELS: ChatChannel[] = [
  { id: '1', name: 'General Command', type: 'SYSTEM', participants: [], unreadCount: 0 },
  { id: '2', name: 'Police Dispatch', type: 'SYSTEM', participants: [], unreadCount: 2 },
  { id: '3', name: 'Fire Dispatch', type: 'SYSTEM', participants: [], unreadCount: 0 },
  { id: '4', name: 'INC-2547 Structure Fire', type: 'INCIDENT', participants: ['Chief Miller', 'Capt. Price'], unreadCount: 5 },
  { id: '5', name: 'City Admin Liaison', type: 'DM', participants: ['Mayor Office'], unreadCount: 0 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', channelId: '4', sender: 'Capt. Price', role: 'Fire Captain', text: 'On scene. Heavy smoke showing from 3rd floor.', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
  { id: '2', channelId: '4', sender: 'Dispatch', role: 'System', text: 'Units FIRE-3 and FIRE-5 arrived.', timestamp: new Date(Date.now() - 1000 * 60 * 9) },
  { id: '3', channelId: '4', sender: 'Chief Miller', role: 'Battalion Chief', text: 'Establish command post at North entrance. We need traffic control on Industrial Pkwy.', timestamp: new Date(Date.now() - 1000 * 60 * 5), isUrgent: true },
  { id: '4', channelId: '4', sender: 'Dispatch', role: 'System', text: 'PD-12 dispatched for traffic control.', timestamp: new Date(Date.now() - 1000 * 60 * 2) },
];

const MOCK_CRISIS_ROOMS: CrisisRoom[] = [
  { id: 'ROOM-1', name: 'Downtown Fire Response', incidentRef: 'INC-2547', activeUsers: 8 },
  { id: 'ROOM-2', name: 'Severe Weather Prep', incidentRef: 'PREP-001', activeUsers: 12 },
];

const CoordinationCenter: React.FC<CoordinationCenterProps> = ({ onBack }) => {
  const [activeChannelId, setActiveChannelId] = useState('4');
  const [messageInput, setMessageInput] = useState('');

  const activeChannel = MOCK_CHANNELS.find(c => c.id === activeChannelId);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex flex-col">
       {/* Header */}
       <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 shadow-lg">
         <div className="max-w-8xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
               </button>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     <Users className="text-blue-500" /> COORDINATION CENTER
                  </h1>
                  <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> 28 Officials Online</span>
                      <span>2 Crisis Rooms Active</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-slate-700">
                    <Video size={16} /> Video Call
                </button>
                <div className="relative">
                    <Bell size={20} className="text-gray-400 hover:text-white cursor-pointer" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
            </div>
         </div>
       </div>

       <div className="flex-1 flex overflow-hidden">
          {/* LEFT: Channel List */}
          <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                  <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input 
                        type="text" 
                        placeholder="Search channels..." 
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-6">
                  {/* System Channels */}
                  <div>
                      <h3 className="px-3 text-xs font-bold text-gray-500 uppercase mb-2">System Channels</h3>
                      <div className="space-y-0.5">
                          {MOCK_CHANNELS.filter(c => c.type === 'SYSTEM').map(channel => (
                              <button 
                                key={channel.id}
                                onClick={() => setActiveChannelId(channel.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${activeChannelId === channel.id ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <Hash size={14} /> {channel.name}
                                  </div>
                                  {channel.unreadCount && channel.unreadCount > 0 ? (
                                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded-full">{channel.unreadCount}</span>
                                  ) : null}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Incident Channels */}
                  <div>
                      <h3 className="px-3 text-xs font-bold text-gray-500 uppercase mb-2 flex justify-between items-center">
                          Active Incidents <Plus size={12} className="cursor-pointer hover:text-white" />
                      </h3>
                      <div className="space-y-0.5">
                          {MOCK_CHANNELS.filter(c => c.type === 'INCIDENT').map(channel => (
                              <button 
                                key={channel.id}
                                onClick={() => setActiveChannelId(channel.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${activeChannelId === channel.id ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`}
                              >
                                  <div className="flex items-center gap-2 truncate">
                                      <Shield size={14} /> <span className="truncate">{channel.name}</span>
                                  </div>
                                  {channel.unreadCount && channel.unreadCount > 0 ? (
                                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">{channel.unreadCount}</span>
                                  ) : null}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Direct Messages */}
                  <div>
                      <h3 className="px-3 text-xs font-bold text-gray-500 uppercase mb-2">Direct Messages</h3>
                      <div className="space-y-0.5">
                          {MOCK_CHANNELS.filter(c => c.type === 'DM').map(channel => (
                              <button 
                                key={channel.id}
                                onClick={() => setActiveChannelId(channel.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${activeChannelId === channel.id ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-green-500"></div> {channel.name}
                                  </div>
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* MIDDLE: Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-950 relative">
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <div>
                      <h2 className="font-bold text-white flex items-center gap-2">
                          {activeChannel?.type === 'INCIDENT' ? <Shield size={18} className="text-red-400" /> : <Hash size={18} className="text-gray-400" />}
                          {activeChannel?.name}
                      </h2>
                      <div className="text-xs text-gray-500 mt-0.5">
                          {activeChannel?.participants.join(', ')} {activeChannel?.participants.length ? 'and others' : ''}
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg">
                          <Search size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg">
                          <MoreVertical size={18} />
                      </button>
                  </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {MOCK_MESSAGES.map((msg) => (
                      <div key={msg.id} className={`flex gap-4 ${msg.isUrgent ? 'bg-red-500/10 p-4 rounded-lg border border-red-500/20' : ''}`}>
                          <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold ${
                              msg.sender === 'System' ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-800 text-gray-300'
                          }`}>
                              {msg.sender.charAt(0)}
                          </div>
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-white text-sm">{msg.sender}</span>
                                  <span className="text-xs text-blue-400 bg-blue-900/20 px-1.5 rounded">{msg.role}</span>
                                  <span className="text-xs text-gray-500 ml-auto">{msg.timestamp.toLocaleTimeString()}</span>
                              </div>
                              <p className={`text-sm ${msg.isUrgent ? 'text-red-200 font-medium' : 'text-gray-300'}`}>
                                  {msg.text}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                  <div className="flex gap-4 bg-slate-950 border border-slate-700 rounded-lg p-2 items-end">
                      <button className="p-2 text-gray-400 hover:text-white rounded hover:bg-slate-800 transition-colors">
                          <Paperclip size={20} />
                      </button>
                      <textarea 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message #${activeChannel?.name}...`}
                        className="flex-1 bg-transparent border-none text-white focus:ring-0 resize-none h-10 py-2 text-sm max-h-32"
                      />
                      <button 
                        className={`p-2 rounded transition-colors ${messageInput.trim() ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-800 text-gray-500'}`}
                      >
                          <Send size={18} />
                      </button>
                  </div>
              </div>
          </div>

          {/* RIGHT: Resources & Rooms */}
          <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">Crisis Coordination Rooms</h3>
              </div>
              <div className="p-2 space-y-2">
                  {MOCK_CRISIS_ROOMS.map(room => (
                      <div key={room.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 hover:border-blue-500 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> LIVE
                              </div>
                              <span className="text-[10px] text-gray-500 font-mono">{room.activeUsers} Users</span>
                          </div>
                          <div className="font-bold text-white text-sm mb-1">{room.name}</div>
                          <div className="text-xs text-gray-500 mb-3">Ref: {room.incidentRef}</div>
                          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-1.5 rounded transition-colors opacity-80 group-hover:opacity-100">
                              JOIN ROOM
                          </button>
                      </div>
                  ))}
                  <button className="w-full border border-dashed border-slate-700 text-gray-500 hover:text-white hover:border-slate-500 p-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                      <Plus size={16} /> Start Crisis Room
                  </button>
              </div>

              <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900">
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Escalation Tools</h3>
                  <div className="space-y-2">
                      <button className="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors">
                          <Phone size={14} /> Call City Admin
                      </button>
                      <button className="w-full bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50 text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors">
                          <FileText size={14} /> Request National Guard
                      </button>
                  </div>
              </div>
          </div>
       </div>
    </div>
  );
};

export default CoordinationCenter;
