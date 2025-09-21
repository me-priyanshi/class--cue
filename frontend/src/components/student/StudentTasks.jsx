import React, { useEffect, useState, useMemo } from 'react';
import { Target, Clock, BookOpen, CheckCircle, AlertCircle, Plus, Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import tasksData from '../../data/tasks.json';

const StudentTasks = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  // const [completedTasks, setCompletedTasks] = useState(new Set());
  // const [academicTasks, setAcademicTasks] = useState([...tasksData.academic]);
  // const [personalTasks, setPersonalTasks] = useState([...tasksData.personal]);
  // Initialize states from localStorage or fallback to default values
  const [academicTasks, setAcademicTasks] = useState(() => {
    const saved = localStorage.getItem('academicTasks');
    return saved ? JSON.parse(saved) : tasksData.academic;
  });

  const [personalTasks, setPersonalTasks] = useState(() => {
    const saved = localStorage.getItem('personalTasks');
    return saved ? JSON.parse(saved) : tasksData.personal;
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return new Set(saved ? JSON.parse(saved) : []);
  });
  
  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('academicTasks', JSON.stringify(academicTasks));
    localStorage.setItem('personalTasks', JSON.stringify(personalTasks));
    localStorage.setItem('completedTasks', JSON.stringify([...completedTasks]));
  }, [academicTasks, personalTasks, completedTasks]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedTime: '',
    category: 'academic',
  });

 

  // ✅ allTasks defined before use
  const allTasks = [...academicTasks, ...personalTasks];

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const categoryMatch =
        selectedCategory === 'all' ||
        (selectedCategory === 'academic' && academicTasks.includes(task)) ||
        (selectedCategory === 'personal' && personalTasks.includes(task));

      const priorityMatch =
        selectedPriority === 'all' || task.priority === selectedPriority;

      return categoryMatch && priorityMatch;
    });
  }, [allTasks, selectedCategory, selectedPriority, academicTasks, personalTasks]);

  const toggleTaskCompletion = (taskId) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (task) => {
    if (tasksData.academic.includes(task)) {
      return <BookOpen className="w-4 h-4" />;
    }
    return <Target className="w-4 h-4" />;
  };

  const getCategoryColor = (task) => {
    if (tasksData.academic.includes(task)) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  const completedCount = completedTasks.size;
  const totalCount = allTasks.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (e) => {
    e.preventDefault();
    const id = Date.now();
    const task = { ...newTask, id };
    if (newTask.category === 'academic') {
      setAcademicTasks([...academicTasks, task]);
    } else {
      setPersonalTasks([...personalTasks, task]);
    }
    setShowAddForm(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      estimatedTime: '',
      category: 'academic',
    });
  };

  const handleDeleteTask = (taskId) => {
    // Remove from completedTasks if it was completed
    const newCompleted = new Set(completedTasks);
    newCompleted.delete(taskId);
    setCompletedTasks(newCompleted);

    // Remove from academic or personal tasks
    setAcademicTasks(academicTasks.filter(task => task.id !== taskId));
    setPersonalTasks(personalTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-900">Tasks & Goals</h1>
              <p className="text-gray-600">Manage your academic and personal tasks</p>
            </div>
          </div>
          <button
              className="ml-4 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 border border-indigo-600 flex items-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="w-4 h-4 mr-1 text-white" />
              New Task
            </button>

          {/* Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add New Task</h2>
                  <button onClick={() => setShowAddForm(false)} className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleAddTask}>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
                    <input type="text" className="input-field w-full" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                    <input type="text" className="input-field w-full" required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Estimated Time</label>
                    <input type="text" className="input-field w-full" required value={newTask.estimatedTime} onChange={e => setNewTask({...newTask, estimatedTime: e.target.value})} />
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Priority</label>
                    <select className="input-field w-full" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                    <select className="input-field w-full" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                      <option value="academic">Academic</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                    <button type="submit" className="btn-primary">Add Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {totalCount - completedCount}
              </p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {progressPercentage}%
              </p>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overall Progress
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} of {totalCount} tasks completed
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`card transition-all duration-200 ${
              completedTasks.has(task.id)
                ? 'bg-green-50 border-green-200'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start">
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 mt-1 transition-all duration-200 ${
                  completedTasks.has(task.id)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-primary-500'
                }`}
              >
                {completedTasks.has(task.id) && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3
                        className={`font-medium ${
                          completedTasks.has(task.id)
                            ? 'text-green-800 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        completedTasks.has(task.id)
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {task.description}
                    </p>

                    <div className="flex items-center mt-3 space-x-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                          task
                        )}`}
                      >
                        <div className="flex items-center">
                          {getCategoryIcon(task)}
                          <span className="ml-1">
                            {academicTasks.includes(task)
                              ? 'Academic'
                              : 'Personal'}
                          </span>
                        </div>
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority} priority
                      </span>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {task.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="card text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Tasks Found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or add new tasks to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentTasks;
