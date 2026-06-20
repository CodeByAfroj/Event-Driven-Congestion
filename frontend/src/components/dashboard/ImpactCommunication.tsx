import { motion } from 'framer-motion';
import { Target, Users, MapPin, Clock, AlertTriangle } from 'lucide-react';
import type { PredictResponse } from '@/types';

export const ImpactCommunication = ({
  prediction,
}: {
  prediction: PredictResponse;
}) => {
  const impact = prediction.impact_analysis;

  const radius = Number(
    impact?.impact_radius_km || 2.63
  );

  const vehicles = Number(
    impact?.estimated_vehicle_impact || 1713
  );

  const junctions =
    impact?.affected_junctions || [];

  const delay = Number(
    prediction.commander?.expected_delay || 31
  );

  const severityScore = Math.min(
    100,
    Math.round(
      (vehicles / 2000) * 40 +
      (radius / 5) * 30 +
      (junctions.length / 10) * 30
    )
  );

  const severity =
    severityScore > 75
      ? "CRITICAL"
      : severityScore > 55
      ? "HIGH"
      : severityScore > 35
      ? "MEDIUM"
      : "LOW";

  const severityColor =
    severity === "CRITICAL"
      ? "#EF4444"
      : severity === "HIGH"
      ? "#F59E0B"
      : severity === "MEDIUM"
      ? "#3B82F6"
      : "#10B981";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        background: "linear-gradient(145deg, var(--bg-card) 0%, rgba(245, 158, 11, 0.03) 100%)",
        border: "1px solid var(--border)",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom:
            "1px solid rgba(255,255,255,.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#F59E0B",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".12em",
            }}
          >
            IMPACT INTELLIGENCE CENTER
          </div>

          <h2
            style={{
              marginTop: 8,
              fontSize: "2rem",
              fontWeight: 800,
            }}
          >
            Operational Impact Assessment
          </h2>
        </div>

        <div
          style={{
            padding: ".6rem 1rem",
            borderRadius: 999,
            background:
              "rgba(239,68,68,.08)",
            border:
              "1px solid rgba(239,68,68,.25)",
            color: severityColor,
            fontWeight: 800,
          }}
        >
          {severity} IMPACT
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="grid-kpi" style={{ padding: "1.5rem" }}>
        {[
          {
            title: "Impact Radius",
            value: `${radius} km`,
            icon: <Target size={18} />,
            color: "#EF4444",
          },
          {
            title: "Vehicles Impacted",
            value:
              vehicles.toLocaleString(),
            icon: <Users size={18} />,
            color: "#F59E0B",
          },
          {
            title: "Junctions",
            value: junctions.length,
            icon: <MapPin size={18} />,
            color: "#8B5CF6",
          },
          {
            title: "Delay Window",
            value: `${delay} min`,
            icon: <Clock size={18} />,
            color: "#3B82F6",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4, boxShadow: `0 8px 32px ${item.color}25, inset 0 1px 0 rgba(255,255,255,0.1)` }}
            style={{
              padding: "1.25rem",
              borderRadius: "var(--radius-lg)",
              background: `linear-gradient(145deg, rgba(15,22,35,0.6) 0%, ${item.color}0A 100%)`,
              border: `1px solid ${item.color}25`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color:
                    "var(--text-secondary)",
                  fontSize: 12,
                  textTransform:
                    "uppercase",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  color: item.color,
                }}
              >
                {item.icon}
              </div>
            </div>

            <div
              style={{
                marginTop: ".7rem",
                fontSize: "2rem",
                fontWeight: 900,
                color: item.color,
              }}
            >
              {item.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SEVERITY BAR */}

      <div
        style={{
          padding: "0 1.5rem 1.5rem",
        }}
      >
        <div
          style={{
            marginBottom: ".5rem",
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span
            style={{
              fontWeight: 700,
            }}
          >
            Impact Severity Index
          </span>

          <span
            style={{
              color: severityColor,
              fontWeight: 800,
            }}
          >
            {severityScore}/100
          </span>
        </div>

        <div
          style={{
            height: 12,
            borderRadius: 999,
            overflow: "hidden",
            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${severityScore}%`,
            }}
            transition={{
              duration: 1,
            }}
            style={{
              height: "100%",
              background: severityColor,
              boxShadow: `0 0 20px ${severityColor}`,
              borderRadius: 999,
            }}
          />
        </div>
      </div>

      {/* AFFECTED JUNCTIONS */}

      <div
        style={{
          padding: "0 1.5rem 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
            marginBottom: "1rem",
          }}
        >
          <AlertTriangle
            size={18}
            color="#F59E0B"
          />

          <span
            style={{
              fontWeight: 800,
            }}
          >
            Critical Junctions
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gap: ".75rem",
          }}
        >
          {junctions.map(
            (junction, index) => (
              <div
                key={index}
                style={{
                  padding:
                    ".9rem 1rem",
                  borderRadius: 14,
                  background:
                    "#0D1728",
                  border:
                    "1px solid rgba(255,255,255,.06)",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {junction}
                </span>

                <span
                  style={{
                    color:
                      index < 2
                        ? "#EF4444"
                        : "#F59E0B",
                    fontWeight: 800,
                  }}
                >
                  {index < 2
                    ? "P1"
                    : "P2"}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};
