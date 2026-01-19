import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Play,
  CheckCircle,
  Lock,
  ChevronRight,
  Trophy,
  Target,
  Flame,
  Star,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { learningService, lessons } from '../../services/learningContent';
import { Lesson, LessonContent, Badge, Quiz } from '../../types';

const LearnTab: React.FC = () => {
  const { user, completeLesson, addBadge } = useUser();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const completedLessons = user?.completedLessons || [];
  const progress = learningService.calculateProgress(completedLessons);
  const earnedBadges = user?.badges || [];

  const categories = [
    { id: 'basics', label: 'Investing Basics', emoji: '📚', color: 'bg-primary-500/20 text-primary-400' },
    { id: 'reading-stocks', label: 'Reading Stocks', emoji: '📈', color: 'bg-success-500/20 text-success-400' },
    { id: 'risk-safety', label: 'Risk & Safety', emoji: '🛡️', color: 'bg-warning-500/20 text-warning-400' },
    { id: 'strategies', label: 'Strategies', emoji: '🎯', color: 'bg-purple-500/20 text-purple-400' },
  ];

  const getCategoryLessons = (categoryId: string) =>
    lessons.filter(l => l.category === categoryId);

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.includes(lessonId);

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowQuiz(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleCompleteLesson = () => {
    if (!selectedLesson) return;

    completeLesson(selectedLesson.id);

    // Award badge if lesson has one
    if (selectedLesson.badge) {
      addBadge(selectedLesson.badge);
    }

    setSelectedLesson(null);
  };

  const handleSubmitQuiz = () => {
    if (!selectedLesson?.quiz) return;

    setQuizSubmitted(true);

    // Check if passed
    const correctCount = selectedLesson.quiz.questions.filter(
      q => quizAnswers[q.id] === q.correctIndex
    ).length;
    const score = (correctCount / selectedLesson.quiz.questions.length) * 100;

    if (score >= selectedLesson.quiz.passingScore) {
      // Award quiz ace badge if 100%
      if (score === 100) {
        addBadge({
          id: 'quiz-ace',
          name: 'Quiz Ace',
          description: 'Got 100% on a quiz',
          icon: '🏆',
          category: 'achievement',
        });
      }
    }
  };

  const ContentBlock: React.FC<{ content: LessonContent; index: number }> = ({ content, index }) => {
    const getIcon = () => {
      switch (content.type) {
        case 'tip': return <Lightbulb className="w-5 h-5" />;
        case 'warning': return <AlertTriangle className="w-5 h-5" />;
        case 'example': return <Info className="w-5 h-5" />;
        case 'interactive': return <HelpCircle className="w-5 h-5" />;
        default: return null;
      }
    };

    const getStyle = () => {
      switch (content.type) {
        case 'tip': return 'bg-success-500/10 border-success-500/30 text-success-300';
        case 'warning': return 'bg-danger-500/10 border-danger-500/30 text-danger-300';
        case 'example': return 'bg-primary-500/10 border-primary-500/30 text-primary-300';
        case 'interactive': return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
        default: return 'bg-transparent';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`mb-6 ${content.type !== 'text' ? `p-4 rounded-xl border ${getStyle()}` : ''}`}
      >
        {content.title && (
          <div className="flex items-center gap-2 mb-2 font-semibold">
            {getIcon()}
            <span>{content.title}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap leading-relaxed">
          {content.content.split('\n').map((line, i) => {
            // Handle bold text
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
              <p key={i} className={i > 0 ? 'mt-2' : ''}>
                {parts.map((part, j) => (
                  j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part
                ))}
              </p>
            );
          })}
        </div>
      </motion.div>
    );
  };

  // Lesson Detail View
  if (selectedLesson) {
    return (
      <div className="min-h-screen pb-24 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 z-10">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={() => setSelectedLesson(null)}
              className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold">{selectedLesson.title}</h1>
              <p className="text-sm text-gray-400">{selectedLesson.duration} min read</p>
            </div>
          </div>
          {/* Progress */}
          <div className="h-1 bg-gray-800">
            <motion.div
              className="h-full bg-primary-500"
              initial={{ width: 0 }}
              animate={{ width: showQuiz ? '100%' : '50%' }}
            />
          </div>
        </div>

        {!showQuiz ? (
          /* Lesson Content */
          <div className="p-4">
            {selectedLesson.content.map((content, index) => (
              <ContentBlock key={index} content={content} index={index} />
            ))}

            {/* Actions */}
            <div className="mt-8 space-y-3">
              {selectedLesson.quiz ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Take Quiz
                </button>
              ) : (
                <button
                  onClick={handleCompleteLesson}
                  className="btn-success w-full flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz View */
          <div className="p-4">
            <h2 className="text-xl font-bold mb-6">Quiz Time! 📝</h2>

            {selectedLesson.quiz?.questions.map((question, qIndex) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className="mb-6"
              >
                <h3 className="font-medium mb-3">{qIndex + 1}. {question.question}</h3>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = quizAnswers[question.id] === oIndex;
                    const isCorrect = question.correctIndex === oIndex;
                    const showResult = quizSubmitted;

                    let buttonStyle = 'bg-gray-800 border-gray-700 hover:border-gray-600';
                    if (showResult && isCorrect) {
                      buttonStyle = 'bg-success-500/20 border-success-500';
                    } else if (showResult && isSelected && !isCorrect) {
                      buttonStyle = 'bg-danger-500/20 border-danger-500';
                    } else if (isSelected && !showResult) {
                      buttonStyle = 'bg-primary-500/20 border-primary-500';
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => !quizSubmitted && setQuizAnswers(prev => ({
                          ...prev,
                          [question.id]: oIndex
                        }))}
                        disabled={quizSubmitted}
                        className={`w-full p-3 rounded-xl border text-left transition-all ${buttonStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-primary-500 bg-primary-500' : 'border-gray-600'
                          }`}>
                            {isSelected && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {quizSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mt-2 p-3 rounded-lg text-sm ${
                      quizAnswers[question.id] === question.correctIndex
                        ? 'bg-success-500/10 text-success-400'
                        : 'bg-danger-500/10 text-danger-400'
                    }`}
                  >
                    {question.explanation}
                  </motion.div>
                )}
              </motion.div>
            ))}

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length !== selectedLesson.quiz?.questions.length}
                className="btn-primary w-full"
              >
                Submit Quiz
              </button>
            ) : (
              <div className="space-y-4">
                <div className="text-center p-4 bg-gray-800 rounded-xl">
                  <div className="text-3xl mb-2">
                    {selectedLesson.quiz?.questions.filter(
                      q => quizAnswers[q.id] === q.correctIndex
                    ).length === selectedLesson.quiz?.questions.length ? '🎉' : '👍'}
                  </div>
                  <div className="font-bold text-lg">
                    Score: {selectedLesson.quiz?.questions.filter(
                      q => quizAnswers[q.id] === q.correctIndex
                    ).length} / {selectedLesson.quiz?.questions.length}
                  </div>
                </div>
                <button
                  onClick={handleCompleteLesson}
                  className="btn-success w-full flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Lesson
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Main Learn Tab View
  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="p-4 pb-0">
        <h1 className="text-2xl font-bold mb-2">Learn Investing</h1>
        <p className="text-gray-400 mb-6">Master the basics at your own pace</p>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-6 bg-gradient-to-br from-primary-500/20 to-primary-600/10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary-400" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <span className="text-primary-400 font-bold">{progress.percentage}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{progress.completed} of {progress.total} lessons completed</span>
            {user?.streak && user.streak > 0 && (
              <div className="flex items-center gap-1 text-warning-400">
                <Flame className="w-4 h-4" />
                <span>{user.streak} day streak!</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Badges Preview */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Your Badges</span>
              <span className="text-sm text-gray-400">{earnedBadges.length} earned</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {earnedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 flex flex-col items-center p-3 bg-gray-800 rounded-xl min-w-[80px]"
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-xs text-gray-400 text-center">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lesson Categories */}
      <div className="px-4">
        {categories.map((category, catIndex) => {
          const categoryLessons = getCategoryLessons(category.id);
          const completedCount = categoryLessons.filter(l => isLessonCompleted(l.id)).length;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.emoji}</span>
                  <span className="font-semibold">{category.label}</span>
                </div>
                <span className="text-sm text-gray-400">
                  {completedCount}/{categoryLessons.length}
                </span>
              </div>

              <div className="space-y-2">
                {categoryLessons.map((lesson, index) => {
                  const isComplete = isLessonCompleted(lesson.id);

                  return (
                    <motion.button
                      key={lesson.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleStartLesson(lesson)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        isComplete
                          ? 'bg-success-500/10 border-success-500/30'
                          : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isComplete ? 'bg-success-500' : 'bg-gray-700'
                        }`}>
                          {isComplete ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-sm text-gray-400">{lesson.description}</div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{lesson.duration} min</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              lesson.difficulty === 'easy'
                                ? 'bg-success-500/20 text-success-400'
                                : lesson.difficulty === 'medium'
                                ? 'bg-warning-500/20 text-warning-400'
                                : 'bg-danger-500/20 text-danger-400'
                            }`}>
                              {lesson.difficulty}
                            </span>
                            {lesson.quiz && <span>📝 Quiz</span>}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LearnTab;
