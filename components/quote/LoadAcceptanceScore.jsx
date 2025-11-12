"use client";

import React from "react";
import { Star, TrendingUp, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { Card } from "@/components/ui";

export default function LoadAcceptanceScore({ scoreData }) {
  if (!scoreData) {
    return null;
  }

  const { score, rating, ratingColor, recommendation, factors } = scoreData;

  // Get color styles based on rating color
  const getColorStyles = () => {
    const styles = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-900',
        badge: 'bg-green-600',
        scoreBg: 'bg-gradient-to-br from-green-50 to-green-100',
        icon: <CheckCircle size={32} className="text-green-600" />
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-900',
        badge: 'bg-blue-600',
        scoreBg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        icon: <TrendingUp size={32} className="text-blue-600" />
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-300',
        text: 'text-yellow-900',
        badge: 'bg-yellow-600',
        scoreBg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        icon: <Info size={32} className="text-yellow-600" />
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-300',
        text: 'text-orange-900',
        badge: 'bg-orange-600',
        scoreBg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        icon: <AlertTriangle size={32} className="text-orange-600" />
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-300',
        text: 'text-red-900',
        badge: 'bg-red-600',
        scoreBg: 'bg-gradient-to-br from-red-50 to-red-100',
        icon: <XCircle size={32} className="text-red-600" />
      }
    };

    return styles[ratingColor] || styles.blue;
  };

  const colorStyle = getColorStyles();

  // Get status icon for each factor
  const getFactorIcon = (status) => {
    if (status === 'excellent' || status === 'good') {
      return <CheckCircle size={20} className="text-green-600" />;
    } else if (status === 'fair') {
      return <Info size={20} className="text-yellow-600" />;
    } else if (status === 'caution') {
      return <AlertTriangle size={20} className="text-orange-600" />;
    } else {
      return <XCircle size={20} className="text-red-600" />;
    }
  };

  // Generate star array (10 stars)
  const stars = Array.from({ length: 10 }, (_, i) => i + 1);
  const filledStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;

  return (
    <Card className={`p-6 bg-white border-2 ${colorStyle.border}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="text-yellow-500 fill-yellow-500" size={24} />
        <h3 className="text-xl font-bold text-gray-900">Load Acceptance Score</h3>
      </div>

      {/* Main Score Display - BIG AND PROMINENT */}
      <div className={`p-8 rounded-xl border-2 ${colorStyle.border} ${colorStyle.scoreBg} mb-6`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Score Number */}
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600 font-semibold mb-2">Overall Score</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-7xl font-bold ${colorStyle.text}`}>
                {score.toFixed(1)}
              </span>
              <span className="text-3xl text-gray-500 font-bold">/10</span>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-0.5 mt-3">
              {stars.map((num) => (
                <Star
                  key={num}
                  size={24}
                  className={
                    num <= filledStars
                      ? "text-yellow-500 fill-yellow-500"
                      : num === filledStars + 1 && hasHalfStar
                      ? "text-yellow-500 fill-yellow-500 opacity-50"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          {/* Right: Rating Badge */}
          <div className="text-center md:text-right">
            {colorStyle.icon}
            <div className={`mt-3 px-6 py-3 ${colorStyle.badge} text-white rounded-lg`}>
              <p className="text-2xl font-bold">{rating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Factor Breakdown */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 mb-4">Score Factors Breakdown</h4>
        <div className="space-y-3">
          {factors.map((factor, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getFactorIcon(factor.status)}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {factor.name}
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        ({factor.weight}% weight)
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">{factor.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {factor.score.toFixed(1)}/10
                  </p>
                </div>
              </div>

              {/* Factor detail */}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>{factor.detail}</span>
                <span className="font-medium capitalize">{factor.status}</span>
              </div>

              {/* Visual bar */}
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    factor.status === 'excellent' || factor.status === 'good'
                      ? 'bg-green-600'
                      : factor.status === 'fair'
                      ? 'bg-yellow-600'
                      : factor.status === 'caution'
                      ? 'bg-orange-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${(factor.score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation - PROMINENT FINAL DECISION */}
      <div className={`p-6 rounded-lg border-2 ${colorStyle.border} ${colorStyle.bg}`}>
        <div className="flex items-start gap-4">
          {colorStyle.icon}
          <div className="flex-1">
            <h4 className={`text-xl font-bold ${colorStyle.text} mb-2`}>
              {rating === 'EXCELLENT LOAD' || rating === 'GOOD LOAD' ? '✓' : '⚠'} Final Recommendation
            </h4>
            <p className={`text-base font-medium ${colorStyle.text}`}>
              {recommendation}
            </p>

            {/* Additional context based on rating */}
            {(rating === 'EXCELLENT LOAD' || rating === 'GOOD LOAD') && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-700">
                  <strong>Next Steps:</strong> Proceed with booking this load. All critical factors are favorable, and this represents a profitable opportunity for your business.
                </p>
              </div>
            )}

            {rating === 'FAIR LOAD' && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-700">
                  <strong>Consider:</strong> Review the factor breakdown above carefully. This load has both positive and negative aspects. Make sure you understand the risks before accepting.
                </p>
              </div>
            )}

            {(rating === 'POOR LOAD' || rating === 'AVOID THIS LOAD') && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-700">
                  <strong>Warning:</strong> Multiple risk factors have been identified with this load. Unless you have specific business reasons to accept (existing customer relationship, positioning needs, etc.), we recommend declining this opportunity.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong className="text-gray-900">How this score is calculated:</strong>{' '}
          This score analyzes 5 critical factors: Rate vs Cost (30%), Market Conditions (20%), Return Load Potential (20%), Deadhead Distance (15%), and Weather Risk (15%). Each factor is weighted based on its impact on profitability and operational efficiency.
        </p>
      </div>
    </Card>
  );
}
