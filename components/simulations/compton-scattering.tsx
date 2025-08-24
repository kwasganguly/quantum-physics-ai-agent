"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ComptonScattering() {
  const [photonEnergy, setPhotonEnergy] = useState([100])
  const [scatteringAngle, setScatteringAngle] = useState([45])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationStep, setAnimationStep] = useState(0)

  // Compton scattering formula: λ' - λ = (h/mₑc)(1 - cos θ)
  const calculateScatteredEnergy = () => {
    const theta = (scatteringAngle[0] * Math.PI) / 180
    const comptonWavelength = 2.426e-12 // meters
    const initialWavelength = 1.24e-6 / photonEnergy[0] // meters (E = hc/λ)
    const deltaWavelength = comptonWavelength * (1 - Math.cos(theta))
    const finalWavelength = initialWavelength + deltaWavelength
    const finalEnergy = 1.24e-6 / finalWavelength
    return finalEnergy
  }

  const calculateElectronEnergy = () => {
    return photonEnergy[0] - calculateScatteredEnergy()
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isAnimating) {
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 100)
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isAnimating])

  const scatteredEnergy = calculateScatteredEnergy()
  const electronEnergy = calculateElectronEnergy()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Simulation Controls</CardTitle>
            <CardDescription className="text-slate-300">Adjust photon energy and scattering angle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Incident Photon Energy: {photonEnergy[0]} keV
              </label>
              <Slider
                value={photonEnergy}
                onValueChange={setPhotonEnergy}
                max={1000}
                min={10}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Scattering Angle: {scatteringAngle[0]}°
              </label>
              <Slider
                value={scatteringAngle}
                onValueChange={setScatteringAngle}
                max={180}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <Button
              onClick={() => setIsAnimating(!isAnimating)}
              className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600"
            >
              {isAnimating ? "Stop Animation" : "Start Animation"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Scattering Results</CardTitle>
            <CardDescription className="text-slate-300">Energy conservation in Compton scattering</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Initial Photon Energy:</span>
                <span className="text-blue-400 font-mono">{photonEnergy[0]} keV</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Scattered Photon Energy:</span>
                <span className="text-green-400 font-mono">{scatteredEnergy.toFixed(1)} keV</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Electron Kinetic Energy:</span>
                <span className="text-orange-400 font-mono">{electronEnergy.toFixed(1)} keV</span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-slate-600 pt-2">
                <span className="text-white">Energy Conservation:</span>
                <span className="text-purple-400 font-mono">{(scatteredEnergy + electronEnergy).toFixed(1)} keV</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 mt-4">
              <p>Compton Formula:</p>
              <p className="font-mono">λ' - λ = (h/mₑc)(1 - cos θ)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Compton Scattering Visualization</CardTitle>
          <CardDescription className="text-slate-300">Photon-electron collision and energy transfer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-96 bg-slate-800 rounded-lg overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="1" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Electron at center */}
              <circle
                cx="400"
                cy="200"
                r="15"
                fill="#f59e0b"
                stroke="#fbbf24"
                strokeWidth="2"
                className={isAnimating ? "animate-pulse" : ""}
              />
              <text x="400" y="240" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                Electron
              </text>

              {/* Incident photon */}
              <g>
                <line
                  x1={isAnimating ? 50 + animationStep * 3.5 : 50}
                  y1="200"
                  x2={isAnimating ? 100 + animationStep * 3.5 : 350}
                  y2="200"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  markerEnd="url(#arrowBlue)"
                />
                <text x="200" y="180" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="bold">
                  Incident Photon ({photonEnergy[0]} keV)
                </text>

                {/* Photon wave representation */}
                <path
                  d={`M ${isAnimating ? 50 + (animationStep * 3.5) : 50} 200 ${Array.from({ length: 30 }, (_, i) => {
                    const x = (isAnimating ? 50 + animationStep * 3.5 : 50) + i * 10
                    const y = 200 + Math.sin((x - (isAnimating ? animationStep * 5 : 0)) * 0.1) * 8
                    return `L ${x} ${y}`
                  }).join(" ")}`}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  opacity="0.7"
                />
              </g>

              {/* Scattered photon */}
              {(isAnimating && animationStep > 70) || !isAnimating ? (
                <g>
                  <line
                    x1="400"
                    y1="200"
                    x2={400 + 200 * Math.cos((scatteringAngle[0] * Math.PI) / 180)}
                    y2={200 - 200 * Math.sin((scatteringAngle[0] * Math.PI) / 180)}
                    stroke="#10b981"
                    strokeWidth="3"
                    markerEnd="url(#arrowGreen)"
                  />
                  <text
                    x={400 + 100 * Math.cos((scatteringAngle[0] * Math.PI) / 180)}
                    y={200 - 100 * Math.sin((scatteringAngle[0] * Math.PI) / 180) - 10}
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Scattered Photon ({scatteredEnergy.toFixed(1)} keV)
                  </text>
                </g>
              ) : null}

              {/* Recoil electron */}
              {(isAnimating && animationStep > 70) || !isAnimating ? (
                <g>
                  <line
                    x1="400"
                    y1="200"
                    x2={400 + 150 * Math.cos(((180 - scatteringAngle[0]) * Math.PI) / 180)}
                    y2={200 - 150 * Math.sin(((180 - scatteringAngle[0]) * Math.PI) / 180)}
                    stroke="#f97316"
                    strokeWidth="3"
                    markerEnd="url(#arrowOrange)"
                  />
                  <text
                    x={400 + 75 * Math.cos(((180 - scatteringAngle[0]) * Math.PI) / 180)}
                    y={200 - 75 * Math.sin(((180 - scatteringAngle[0]) * Math.PI) / 180) + 20}
                    textAnchor="middle"
                    fill="#f97316"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Recoil Electron ({electronEnergy.toFixed(1)} keV)
                  </text>
                </g>
              ) : null}

              {/* Angle arc */}
              <path
                d={`M 450 200 A 50 50 0 0 0 ${400 + 50 * Math.cos((scatteringAngle[0] * Math.PI) / 180)} ${200 - 50 * Math.sin((scatteringAngle[0] * Math.PI) / 180)}`}
                fill="none"
                stroke="#a855f7"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text x="470" y="190" fill="#a855f7" fontSize="12" fontWeight="bold">
                θ = {scatteringAngle[0]}°
              </text>

              {/* Arrow markers */}
              <defs>
                <marker id="arrowBlue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                </marker>
                <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                </marker>
                <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
                </marker>
              </defs>
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Theory */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Compton Scattering Theory</CardTitle>
        </CardHeader>
        <CardContent className="text-slate-300 space-y-4">
          <p>
            Compton scattering demonstrates the particle nature of light. When a high-energy photon collides with a free
            electron, both energy and momentum are conserved, resulting in a scattered photon with lower energy and a
            recoiling electron.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-2">Key Principles:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Energy conservation: E₀ = E' + Eₑ</li>
                <li>• Momentum conservation in x and y directions</li>
                <li>• Photon wavelength increases after scattering</li>
                <li>• Maximum energy transfer at θ = 180°</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Applications:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Medical imaging (Compton cameras)</li>
                <li>• Astrophysics (gamma-ray astronomy)</li>
                <li>• Material analysis</li>
                <li>• Radiation shielding design</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
