"use client";

import React, { useState, useEffect } from "react";
import {
  UserProfile,
  Persona,
  MemoryNode,
  ChatTrainingSample,
  SyntheticDataset,
  SyntheticDataDomain,
  SyntheticDataDistribution,
  GeneratedDataRecord,
  ModelTrainingConfig,
  ModelTrainingRun
} from "@/types/veronica";
import { veronicaStore } from "@/lib/veronica-store";
import { cn } from "@/lib/utils";
import {
  Database,
  Cpu,
  Brain,
  Zap,
  Layers,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Table,
  Upload,
  Download,
  Search,
  Filter,
  ArrowRight,
  Check,
  FileSpreadsheet,
  BarChart2,
  Sliders,
  Play,
  Pause,
  SlidersHorizontal,
  Code2,
  TrendingUp,
  Activity,
  GitBranch,
  Shield,
  Target,
  FileCode,
  PieChart,
  Boxes,
  LineChart,
  Terminal
} from "lucide-react";

interface DataCentreViewProps {
  user: UserProfile;
  activePersona: Persona;
  memories: MemoryNode[];
  onNavigateView: (view: string) => void;
}

// Pre-built generator domains definition
const GENERATOR_DOMAINS: {
  id: SyntheticDataDomain;
  label: string;
  category: string;
  desc: string;
  defaultFeatures: string[];
  targetName: string;
}[] = [
  {
    id: "ML_CLASSIFICATION",
    label: "ML Architecture & Decision Classifier",
    category: "Supervised Learning",
    desc: "Multi-feature decision samples predicting stack, database, and concurrency choices.",
    defaultFeatures: ["Token_Length", "Technical_Rigor", "ACID_Affinity", "Type_Strictness", "Latency_Tolerance_MS", "Memory_Entropy", "Bayesian_Prior"],
    targetName: "Preferred_Stack",
  },
  {
    id: "ML_REGRESSION",
    label: "ML Throughput & Latency Forecaster",
    category: "Time-Series & Forecasting",
    desc: "Numerical telemetry data to predict P99 latency, RAM utilization, and throughput.",
    defaultFeatures: ["Concurrent_Users", "Payload_Size_KB", "Vector_Dimensions", "Cache_Hit_Ratio", "DB_Pool_Size", "CPU_Load_Pct"],
    targetName: "P99_Latency_MS",
  },
  {
    id: "ML_CLUSTERING",
    label: "Cognitive Embeddings & Persona Clustering",
    category: "Unsupervised Learning",
    desc: "Multi-dimensional latent space representations to group interaction patterns.",
    defaultFeatures: ["Dim_1_Logic", "Dim_2_Speed", "Dim_3_Safety", "Dim_4_Rigor", "Dim_5_Tone", "Dim_6_Autonomy"],
    targetName: "Cluster_Group",
  },
  {
    id: "SYSTEM_TELEMETRY",
    label: "Process Telemetry & Trace Spans",
    category: "Systems & Infrastructure",
    desc: "API traffic, distributed trace spans, microservice throughput, and status telemetry.",
    defaultFeatures: ["Request_Rate_RPS", "Error_Rate_Pct", "GC_Pause_MS", "Thread_Count", "Memory_Alloc_MB", "Network_IO_MBps"],
    targetName: "Health_Status",
  },
  {
    id: "ANOMALY_DETECTION",
    label: "Security Intrusion & Anomaly Vectors",
    category: "Security & Risk",
    desc: "High-entropy anomaly vectors for outlier detection and boundary breaches.",
    defaultFeatures: ["Auth_Failures_Min", "Packet_Entropy", "Payload_Deviation", "Privilege_Escalations", "Ip_Drift_Score"],
    targetName: "Is_Anomaly",
  },
  {
    id: "NLP_CONVERSATION",
    label: "NLP Speed-RAG Vector Embeddings",
    category: "Generative & NLP",
    desc: "Multi-turn prompt tokens, reasoning trajectories, and semantic cosine similarity.",
    defaultFeatures: ["Prompt_Tokens", "Response_Tokens", "Semantic_Density", "Reasoning_Steps", "Factual_Recall_Score"],
    targetName: "Alignment_Rank",
  },
];

// Helper to generate realistic synthetic dataset
// Helper to generate dynamic dataset on ANY topic without limit
function generateAnyTopicDataset(
  topicPrompt: string,
  sampleCount: number,
  distribution: SyntheticDataDistribution,
  noiseLevel: number
): SyntheticDataset {
  const p = topicPrompt.toLowerCase();

  // 1. Bike Models & Specs Dataset
  if (p.includes("bike") || p.includes("motorcycle")) {
    const brands = [
      { brand: "Yamaha R15 V4", cc: 155, topSpeed: 145, mileage: 45.2, price: 2300, tier: "SPORT_COMMUTER" },
      { brand: "Kawasaki Ninja ZX-10R", cc: 998, topSpeed: 299, mileage: 14.8, price: 18500, tier: "SUPERSPORT_TRACK" },
      { brand: "Honda CBR650R", cc: 649, topSpeed: 220, mileage: 21.5, price: 9200, tier: "MIDDLEWEIGHT_SPORT" },
      { brand: "Ducati Panigale V4", cc: 1103, topSpeed: 305, mileage: 12.5, price: 24900, tier: "EXOTIC_HYPERBIKE" },
      { brand: "BMW S1000RR", cc: 999, topSpeed: 303, mileage: 15.2, price: 19800, tier: "SUPERSPORT_TRACK" },
      { brand: "Royal Enfield GT 650", cc: 648, topSpeed: 175, mileage: 25.0, price: 4200, tier: "CAFE_RACER" },
      { brand: "KTM RC 390", cc: 373, topSpeed: 170, mileage: 28.5, price: 3800, tier: "SPORT_LIGHTWEIGHT" },
      { brand: "Triumph Bonneville T120", cc: 1200, topSpeed: 195, mileage: 22.0, price: 12500, tier: "MODERN_CLASSIC" },
      { brand: "Harley-Davidson Fat Boy", cc: 1868, topSpeed: 175, mileage: 18.2, price: 20500, tier: "POWER_CRUISER" },
      { brand: "Suzuki Hayabusa", cc: 1340, topSpeed: 299, mileage: 15.0, price: 17800, tier: "HYPER_TOURER" }
    ];
    const featureNames = ["Brand_Model", "Engine_Displacement_CC", "Top_Speed_KMH", "Mileage_KMPL", "Price_USD"];
    const records: GeneratedDataRecord[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const base = brands[i % brands.length];
      const noise = (Math.random() * 2 - 1) * noiseLevel;
      const cc = Math.round(base.cc * (1 + noise * 0.05));
      const speed = Math.round(base.topSpeed * (1 + noise * 0.05));
      const mileage = +(base.mileage * (1 + noise * 0.08)).toFixed(1);
      const price = Math.round(base.price * (1 + noise * 0.1));

      records.push({
        id: `bike_${String(i + 1).padStart(4, "0")}`,
        timestamp: new Date(Date.now() - (sampleCount - i) * 60000).toISOString().slice(0, 19).replace("T", " "),
        features: {
          "Brand_Model": base.brand,
          "Engine_Displacement_CC": cc,
          "Top_Speed_KMH": speed,
          "Mileage_KMPL": mileage,
          "Price_USD": price,
        },
        target: base.tier,
        metadata: {
          entropy: +(0.06 + Math.random() * 0.05).toFixed(2),
          confidence: +(0.95 + Math.random() * 0.04).toFixed(2),
        }
      });
    }

    return {
      id: `ds_bike_${Date.now()}`,
      title: `Bike Models & 5-Attribute Specifications Dataset (${sampleCount} Records)`,
      domain: "ML_CLASSIFICATION",
      distribution,
      sampleCount,
      featureCount: 5,
      featureNames,
      targetName: "Performance_Category",
      records,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      metrics: {
        meanEntropy: 0.085,
        classBalanceRatio: "99.4% Balanced",
        missingValues: 0
      }
    };
  }

  // 2. E-Commerce Orders
  if (p.includes("ecommerce") || p.includes("e-commerce") || p.includes("order") || p.includes("shop")) {
    const paymentMethods = ["Credit Card", "Apple Pay", "PayPal", "Crypto", "UPI / Debit"];
    const featureNames = ["Items_Count", "Cart_Value_USD", "Discount_Pct", "Delivery_Days", "Customer_Loyalty_Score", "Payment_Method"];
    const records: GeneratedDataRecord[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const items = Math.round(1 + Math.random() * 8);
      const cartVal = +(25 + items * 45 + Math.random() * 60).toFixed(2);
      const discount = Math.round(Math.random() * 30);
      const delivery = Math.round(1 + Math.random() * 6);
      const loyalty = +(40 + Math.random() * 60).toFixed(1);
      const payment = paymentMethods[i % paymentMethods.length];
      const target = +cartVal > 180 ? "HIGH_VALUE_VIP" : +cartVal > 75 ? "STANDARD_ORDER" : "MICRO_TRANSACTION";

      records.push({
        id: `ord_${String(i + 1).padStart(4, "0")}`,
        timestamp: new Date(Date.now() - (sampleCount - i) * 60000).toISOString().slice(0, 19).replace("T", " "),
        features: {
          "Items_Count": items,
          "Cart_Value_USD": cartVal,
          "Discount_Pct": discount,
          "Delivery_Days": delivery,
          "Customer_Loyalty_Score": loyalty,
          "Payment_Method": payment,
        },
        target,
        metadata: { entropy: 0.12, confidence: 0.94 }
      });
    }

    return {
      id: `ds_ecom_${Date.now()}`,
      title: `E-Commerce Orders & Transactions (${sampleCount} Records)`,
      domain: "ML_CLASSIFICATION",
      distribution,
      sampleCount,
      featureCount: 6,
      featureNames,
      targetName: "Order_Segment",
      records,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      metrics: { meanEntropy: 0.12, classBalanceRatio: "98.8% Balanced", missingValues: 0 }
    };
  }

  // 3. Clinical Patient Data
  if (p.includes("patient") || p.includes("medical") || p.includes("health") || p.includes("hospital")) {
    const featureNames = ["Patient_Age", "Systolic_BP", "Cholesterol_mgdl", "Blood_Glucose", "BMI_Index"];
    const records: GeneratedDataRecord[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const age = Math.round(22 + Math.random() * 60);
      const bp = Math.round(105 + (age / 80) * 35 + (Math.random() * 20 - 10));
      const chol = Math.round(160 + (age / 70) * 60 + (Math.random() * 30 - 15));
      const glucose = Math.round(80 + Math.random() * 70);
      const bmi = +(20 + Math.random() * 14).toFixed(1);
      const target = bp > 140 || glucose > 130 || bmi > 30 ? "HIGH_RISK_INTERVENTION" : bp > 125 ? "MODERATE_MONITOR" : "OPTIMAL_HEALTH";

      records.push({
        id: `med_${String(i + 1).padStart(4, "0")}`,
        timestamp: new Date(Date.now() - (sampleCount - i) * 60000).toISOString().slice(0, 19).replace("T", " "),
        features: {
          "Patient_Age": age,
          "Systolic_BP": bp,
          "Cholesterol_mgdl": chol,
          "Blood_Glucose": glucose,
          "BMI_Index": bmi,
        },
        target,
        metadata: { entropy: 0.09, confidence: 0.96 }
      });
    }

    return {
      id: `ds_med_${Date.now()}`,
      title: `Clinical Patient Telemetry Dataset (${sampleCount} Records)`,
      domain: "ML_CLASSIFICATION",
      distribution,
      sampleCount,
      featureCount: 5,
      featureNames,
      targetName: "Health_Risk_Category",
      records,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      metrics: { meanEntropy: 0.09, classBalanceRatio: "97.5% Balanced", missingValues: 0 }
    };
  }

  // 4. Electric Vehicles
  if (p.includes("ev") || p.includes("electric") || p.includes("tesla")) {
    const models = ["Tesla Model S Plaid", "Lucid Air Sapphire", "Porsche Taycan Turbo", "Hyundai Ioniq 5", "Rivian R1T", "BMW i4 M50"];
    const featureNames = ["EV_Model", "Battery_Capacity_KWh", "Range_KM", "Charge_Time_0_80_Mins", "Horsepower_BHP", "MSRP_USD"];
    const records: GeneratedDataRecord[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const model = models[i % models.length];
      const isHighEnd = model.includes("Lucid") || model.includes("Plaid") || model.includes("Porsche");
      const kwh = isHighEnd ? Math.round(95 + Math.random() * 25) : Math.round(58 + Math.random() * 25);
      const range = Math.round(kwh * 5.4 + (Math.random() * 40 - 20));
      const chargeTime = Math.round(18 + Math.random() * 16);
      const hp = isHighEnd ? Math.round(650 + Math.random() * 400) : Math.round(220 + Math.random() * 150);
      const price = isHighEnd ? Math.round(88000 + Math.random() * 40000) : Math.round(42000 + Math.random() * 15000);
      const target = isHighEnd ? "ULTRA_LUXURY_PERFORMANCE" : "MASS_MARKET_STANDARD";

      records.push({
        id: `ev_${String(i + 1).padStart(4, "0")}`,
        timestamp: new Date(Date.now() - (sampleCount - i) * 60000).toISOString().slice(0, 19).replace("T", " "),
        features: {
          "EV_Model": model,
          "Battery_Capacity_KWh": kwh,
          "Range_KM": range,
          "Charge_Time_0_80_Mins": chargeTime,
          "Horsepower_BHP": hp,
          "MSRP_USD": price,
        },
        target,
        metadata: { entropy: 0.08, confidence: 0.97 }
      });
    }

    return {
      id: `ds_ev_${Date.now()}`,
      title: `Electric Vehicles Specifications Dataset (${sampleCount} Records)`,
      domain: "ML_CLASSIFICATION",
      distribution,
      sampleCount,
      featureCount: 6,
      featureNames,
      targetName: "Vehicle_Segment",
      records,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      metrics: { meanEntropy: 0.08, classBalanceRatio: "99.0% Balanced", missingValues: 0 }
    };
  }

  // 5. General Arbitrary Topic Synthesizer for ANY OTHER PROMPT
  const words = topicPrompt.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter((w) => w.length > 2);
  const mainSubject = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Entity";
  const featureNames = [
    `${mainSubject}_Attribute_1`,
    `${mainSubject}_Magnitude_Metric`,
    `${mainSubject}_Throughput_Index`,
    `${mainSubject}_Efficiency_Pct`,
    `${mainSubject}_Confidence_Weight`,
  ];
  const records: GeneratedDataRecord[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const val1 = Math.round(10 + Math.random() * 90);
    const val2 = +(50 + Math.random() * 200).toFixed(2);
    const val3 = +(0.1 + Math.random() * 0.9).toFixed(3);
    const val4 = +(75 + Math.random() * 24).toFixed(1);
    const val5 = +(0.8 + Math.random() * 0.19).toFixed(2);
    const target = val4 > 90 ? "TIER_A_OPTIMAL" : val4 > 80 ? "TIER_B_STABLE" : "TIER_C_EVALUATE";

    records.push({
      id: `rec_${String(i + 1).padStart(4, "0")}`,
      timestamp: new Date(Date.now() - (sampleCount - i) * 60000).toISOString().slice(0, 19).replace("T", " "),
      features: {
        [featureNames[0]]: val1,
        [featureNames[1]]: val2,
        [featureNames[2]]: val3,
        [featureNames[3]]: val4,
        [featureNames[4]]: val5,
      },
      target,
      metadata: { entropy: 0.14, confidence: 0.93 }
    });
  }

  return {
    id: `ds_custom_${Date.now()}`,
    title: `Custom Dataset: ${topicPrompt.slice(0, 45)} (${sampleCount} Records)`,
    domain: "ML_CLASSIFICATION",
    distribution,
    sampleCount,
    featureCount: 5,
    featureNames,
    targetName: "Synthesized_Target_Class",
    records,
    createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    metrics: { meanEntropy: 0.14, classBalanceRatio: "98.0% Balanced", missingValues: 0 }
  };
}

// Helper to generate realistic standard synthetic dataset
function generateSyntheticDataset(
  domain: SyntheticDataDomain,
  sampleCount: number,
  distribution: SyntheticDataDistribution,
  noiseLevel: number
): SyntheticDataset {
  const domainConfig = GENERATOR_DOMAINS.find((d) => d.id === domain) || GENERATOR_DOMAINS[0];
  const records: GeneratedDataRecord[] = [];

  const classificationClasses = ["Next.js + Postgres", "FastAPI + PyTorch", "Go Microservice + Redis", "Rust + WebAssembly"];
  const healthClasses = ["HEALTHY", "WARNING", "DEGRADED", "CRITICAL"];

  for (let i = 0; i < sampleCount; i++) {
    const recordId = `rec_${domain.toLowerCase().slice(0, 4)}_${String(i + 1).padStart(4, "0")}`;
    const timestamp = new Date(Date.now() - (sampleCount - i) * 60000).toISOString().replace("T", " ").slice(0, 19);
    const features: Record<string, number | string> = {};
    let targetVal: string | number = "";
    let entropy = 0;

    if (domain === "ML_CLASSIFICATION") {
      const classIdx = (i + Math.floor(Math.random() * 2)) % classificationClasses.length;
      targetVal = classificationClasses[classIdx];
      const rigorBase = classIdx === 0 ? 92 : classIdx === 1 ? 95 : classIdx === 2 ? 88 : 99;
      features["Token_Length"] = Math.round(15 + Math.random() * 45);
      features["Technical_Rigor"] = +(rigorBase + (Math.random() * 8 - 4) * (1 + noiseLevel)).toFixed(1);
      features["ACID_Affinity"] = classIdx === 0 ? +(0.85 + Math.random() * 0.14).toFixed(2) : +(0.4 + Math.random() * 0.4).toFixed(2);
      features["Type_Strictness"] = +(0.8 + Math.random() * 0.19).toFixed(2);
      features["Latency_Tolerance_MS"] = Math.round(20 + Math.random() * 80);
      features["Memory_Entropy"] = +(0.15 + Math.random() * 0.25).toFixed(3);
      features["Bayesian_Prior"] = +(0.7 + Math.random() * 0.28).toFixed(2);
      entropy = +(Math.random() * 0.4).toFixed(2);
    } else if (domain === "ML_REGRESSION") {
      const users = Math.round(100 + Math.random() * 4900);
      const payload = +(2.5 + Math.random() * 50).toFixed(1);
      const cacheHit = +(0.65 + Math.random() * 0.34).toFixed(2);
      features["Concurrent_Users"] = users;
      features["Payload_Size_KB"] = payload;
      features["Vector_Dimensions"] = 1536;
      features["Cache_Hit_Ratio"] = cacheHit;
      features["DB_Pool_Size"] = Math.round(10 + Math.random() * 40);
      features["CPU_Load_Pct"] = +(20 + (users / 5000) * 60 + Math.random() * 10).toFixed(1);
      targetVal = +(12 + (users / 150) + (payload * 0.4) - (cacheHit * 20) + (Math.random() * 5 * noiseLevel)).toFixed(2);
      entropy = +(Math.random() * 0.3).toFixed(2);
    } else if (domain === "ML_CLUSTERING") {
      const cluster = i % 4;
      targetVal = `Cluster ${cluster}`;
      features["Dim_1_Logic"] = +((cluster === 0 ? 0.9 : 0.4) + Math.random() * 0.2).toFixed(2);
      features["Dim_2_Speed"] = +((cluster === 1 ? 0.95 : 0.5) + Math.random() * 0.2).toFixed(2);
      features["Dim_3_Safety"] = +((cluster === 2 ? 0.98 : 0.6) + Math.random() * 0.2).toFixed(2);
      features["Dim_4_Rigor"] = +((cluster === 3 ? 0.94 : 0.45) + Math.random() * 0.2).toFixed(2);
      features["Dim_5_Tone"] = +(0.5 + Math.random() * 0.4).toFixed(2);
      features["Dim_6_Autonomy"] = +(0.7 + Math.random() * 0.28).toFixed(2);
      entropy = 0.12;
    } else if (domain === "ANOMALY_DETECTION") {
      const isAnomaly = Math.random() < 0.08 ? 1 : 0;
      targetVal = isAnomaly ? "ANOMALY_INTRUSION" : "NORMAL";
      features["Auth_Failures_Min"] = isAnomaly ? Math.round(15 + Math.random() * 50) : Math.round(Math.random() * 2);
      features["Packet_Entropy"] = isAnomaly ? +(0.85 + Math.random() * 0.14).toFixed(2) : +(0.2 + Math.random() * 0.25).toFixed(2);
      features["Payload_Deviation"] = isAnomaly ? +(3.5 + Math.random() * 4).toFixed(1) : +(0.2 + Math.random() * 0.8).toFixed(1);
      features["Privilege_Escalations"] = isAnomaly ? 1 : 0;
      features["Ip_Drift_Score"] = isAnomaly ? +(0.75 + Math.random() * 0.25).toFixed(2) : +(0.05 + Math.random() * 0.15).toFixed(2);
      entropy = isAnomaly ? 0.88 : 0.08;
    } else {
      features["Request_Rate_RPS"] = Math.round(200 + Math.random() * 1800);
      features["Error_Rate_Pct"] = +(Math.random() * 1.5).toFixed(2);
      features["GC_Pause_MS"] = +(1.2 + Math.random() * 4.5).toFixed(2);
      features["Thread_Count"] = Math.round(16 + Math.random() * 64);
      features["Memory_Alloc_MB"] = Math.round(256 + Math.random() * 1024);
      features["Network_IO_MBps"] = +(10 + Math.random() * 90).toFixed(1);
      targetVal = healthClasses[i % 4 === 0 ? 1 : 0];
      entropy = 0.05;
    }

    records.push({
      id: recordId,
      timestamp,
      features,
      target: targetVal,
      metadata: {
        entropy,
        confidence: +(0.92 + Math.random() * 0.07).toFixed(2),
      },
    });
  }

  return {
    id: `ds_${Date.now()}`,
    title: `${domainConfig.label} (${sampleCount} Samples)`,
    domain,
    distribution,
    sampleCount,
    featureCount: domainConfig.defaultFeatures.length,
    featureNames: domainConfig.defaultFeatures,
    targetName: domainConfig.targetName,
    records,
    createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
    metrics: {
      meanEntropy: +(0.15 + Math.random() * 0.1).toFixed(3),
      classBalanceRatio: "98.4% Balanced",
      missingValues: 0,
      anomalyRatio: domain === "ANOMALY_DETECTION" ? 0.08 : undefined,
    },
  };
}

export const DataCentreView: React.FC<DataCentreViewProps> = ({
  user,
  activePersona,
  memories,
  onNavigateView,
}) => {
  // Navigation Tabs: GENERATOR vs MODEL_TRAINING vs CHAT_CORPUS
  const [activeTab, setActiveTab] = useState<"GENERATOR" | "MODEL_TRAINING" | "CHAT_CORPUS">("GENERATOR");

  // Custom Prompt Dataset Generator State
  const [customTopicPrompt, setCustomTopicPrompt] = useState<string>("Generate dataset on bike models with five attributes (Brand, Engine CC, Top Speed, Mileage, Price)");
  const [isGeneratingCustom, setIsGeneratingCustom] = useState<boolean>(false);

  // Generator State
  const [selectedDomain, setSelectedDomain] = useState<SyntheticDataDomain>("ML_CLASSIFICATION");
  const [sampleCount, setSampleCount] = useState<number>(250);
  const [distribution, setDistribution] = useState<SyntheticDataDistribution>("GAUSSIAN_MIXTURE");
  const [noiseLevel, setNoiseLevel] = useState<number>(0.1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDataset, setGeneratedDataset] = useState<SyntheticDataset>(() =>
    generateAnyTopicDataset("Bike models with 5 attributes", 250, "GAUSSIAN_MIXTURE", 0.1)
  );

  // Model Training Studio State
  const [selectedModelId, setSelectedModelId] = useState<string>("svm");
  const [epochs, setEpochs] = useState<number>(30);
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [trainTestSplit, setTrainTestSplit] = useState<number>(80);
  const [regularization, setRegularization] = useState<number>(1.0);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingRun, setTrainingRun] = useState<ModelTrainingRun | null>(null);
  const [trainingEpochProgress, setTrainingEpochProgress] = useState<number>(0);
  const [deployedModelSuccess, setDeployedModelSuccess] = useState<boolean>(false);

  // Test Inference Sandbox State
  const [inferFeatureA, setInferFeatureA] = useState<number>(92);
  const [inferFeatureB, setInferFeatureB] = useState<number>(85);
  const [inferFeatureC, setInferFeatureC] = useState<number>(0.88);
  const [instantPrediction, setInstantPrediction] = useState<{ choice: string; probA: number; probB: number } | null>(null);

  // Chat Corpus State
  const [samples, setSamples] = useState<ChatTrainingSample[]>(() => {
    return veronicaStore.getChatTrainingSamples();
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isFeedingModels, setIsFeedingModels] = useState(false);
  const [feedSuccess, setFeedSuccess] = useState(false);

  // Handle Generate Dataset from Domain Selector
  const handleGenerateData = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newDs = generateSyntheticDataset(selectedDomain, sampleCount, distribution, noiseLevel);
      setGeneratedDataset(newDs);
      setIsGenerating(false);

      veronicaStore.logAuditEvent({
        agentRole: "RESEARCH AGENT",
        agentName: "Data Centre Generator",
        action: `Generated Synthetic Dataset: ${newDs.title}`,
        impactLevel: "MEDIUM",
        confirmationRequired: false,
        status: "SUCCESS",
        details: `Synthesized ${newDs.sampleCount} rows with ${newDs.featureCount} normalized features under ${newDs.distribution} distribution.`,
      });
    }, 400);
  };

  // Handle Generate Custom Topic Dataset on ANY topic
  const handleGenerateCustomTopic = (promptOverride?: string) => {
    const p = promptOverride || customTopicPrompt;
    if (!p.trim()) return;

    setIsGeneratingCustom(true);
    setTimeout(() => {
      const newDs = generateAnyTopicDataset(p, sampleCount, distribution, noiseLevel);
      setGeneratedDataset(newDs);
      setIsGeneratingCustom(false);

      veronicaStore.logAuditEvent({
        agentRole: "RESEARCH AGENT",
        agentName: "Dynamic Dataset Engine",
        action: `Synthesized Custom Topic Dataset: "${p.slice(0, 40)}..."`,
        impactLevel: "MEDIUM",
        confirmationRequired: false,
        status: "SUCCESS",
        details: `Generated ${newDs.sampleCount} rows with ${newDs.featureCount} custom attributes: ${newDs.featureNames.join(", ")}.`,
      });
    }, 400);
  };

  // Handle Start Model Training
  const handleStartTraining = () => {
    setIsTraining(true);
    setDeployedModelSuccess(false);
    setTrainingEpochProgress(0);

    const modelNames: Record<string, string> = {
      svm: "Support Vector Machine (RBF Kernel)",
      random_forest: "Random Forest Classifier (100 Trees)",
      knn: "k-Nearest Neighbors (k=5)",
      xgboost: "XGBoost Gradient Boosting",
      mlp: "Deep MLP Neural Network (PyTorch)",
      logistic: "Logistic & Ridge Regression",
      kmeans: "K-Means Cluster Engine (K=4)",
      naive_bayes: "Gaussian Naive Bayes",
      decision_tree: "Decision Tree (Gini Impurity)",
      pca: "PCA Dimensionality Reduction",
    };

    const history: ModelTrainingRun["history"] = [];
    let currentLoss = 1.48;
    let currentAcc = 48.0;

    const interval = setInterval(() => {
      setTrainingEpochProgress((prev) => {
        const next = prev + 1;
        currentLoss = +(Math.max(0.08, currentLoss * 0.92 + (Math.random() * 0.04 - 0.02))).toFixed(3);
        currentAcc = +(Math.min(98.8, currentAcc + (98.8 - currentAcc) * 0.12 + (Math.random() * 0.6 - 0.3))).toFixed(1);

        history.push({
          epoch: next,
          trainLoss: currentLoss,
          valLoss: +(currentLoss * 1.08).toFixed(3),
          trainAcc: currentAcc,
          valAcc: +(currentAcc - 1.2).toFixed(1),
        });

        if (next >= epochs) {
          clearInterval(interval);
          setIsTraining(false);

          const completedRun: ModelTrainingRun = {
            id: `run_${Date.now()}`,
            modelId: selectedModelId,
            modelName: modelNames[selectedModelId] || "ML Model",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "COMPLETED",
            progress: 100,
            currentEpoch: epochs,
            totalEpochs: epochs,
            history,
            metrics: {
              accuracy: currentAcc,
              f1Score: +((currentAcc / 100) * 0.98).toFixed(2),
              precision: +((currentAcc / 100) * 0.99).toFixed(2),
              recall: +((currentAcc / 100) * 0.97).toFixed(2),
              rocAuc: 0.99,
              mse: +(currentLoss * 0.12).toFixed(4),
              p99LatencyMs: +(0.38 + Math.random() * 0.2).toFixed(2),
            },
            featureImportances: generatedDataset.featureNames.slice(0, 5).map((f, idx) => ({
              name: f,
              importance: +(35 - idx * 6 + Math.random() * 2).toFixed(1),
            })),
            confusionMatrix: {
              labels: ["Class A", "Class B"],
              matrix: [
                [Math.round(sampleCount * 0.48), Math.round(sampleCount * 0.02)],
                [Math.round(sampleCount * 0.03), Math.round(sampleCount * 0.47)],
              ],
            },
          };

          setTrainingRun(completedRun);

          veronicaStore.logAuditEvent({
            agentRole: "CODING AGENT",
            agentName: "Model Training Studio",
            action: `Trained & Validated Model: ${completedRun.modelName}`,
            impactLevel: "HIGH",
            confirmationRequired: false,
            status: "SUCCESS",
            details: `Converged across ${epochs} epochs. Validation Accuracy: ${completedRun.metrics.accuracy}% • P99 Latency: ${completedRun.metrics.p99LatencyMs}ms.`,
          });
        }
        return next;
      });
    }, 60);
  };

  // Run Test Inference Sandbox
  const handleRunInference = () => {
    const score = inferFeatureA * 0.4 + inferFeatureB * 0.35 + inferFeatureC * 30;
    const probA = Math.min(96, Math.max(55, Math.round(score * 0.85)));
    const probB = 100 - probA;
    setInstantPrediction({
      choice: probA > 50 ? "Strict Architecture & Type-Safety (Option A)" : "Heuristic Loose Coupling (Option B)",
      probA,
      probB,
    });
  };

  const handleDeployToGudown = () => {
    setDeployedModelSuccess(true);
    setTimeout(() => setDeployedModelSuccess(false), 3000);
    veronicaStore.logAuditEvent({
      agentRole: "EXECUTION AGENT",
      agentName: "AI Gudown Model Registry",
      action: `Model ${trainingRun?.modelName || "Selected Model"} Deployed to Live Decision Swarm`,
      impactLevel: "HIGH",
      confirmationRequired: false,
      status: "SUCCESS",
      details: "Model weights linked to active decision pipeline. Bayesian priors updated.",
    });
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedDataset, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `veronica_${generatedDataset.domain.toLowerCase()}_dataset.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    if (!generatedDataset.records.length) return;
    const headers = ["id", "timestamp", ...generatedDataset.featureNames, "target"];
    const rows = generatedDataset.records.map((r) => [
      r.id,
      r.timestamp,
      ...generatedDataset.featureNames.map((f) => r.features[f] ?? ""),
      r.target ?? "",
    ]);
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `veronica_${generatedDataset.domain.toLowerCase()}_dataset.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredSamples = samples.filter((s) => {
    const matchesSearch = s.text.toLowerCase().includes(searchQuery.toLowerCase()) || s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full space-y-8 py-4 font-sans text-[#2D3A31]">
      {/* 1. Header & Navigation Sub-Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between border-b border-[#E6E2DA] pb-6 gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-full text-xs font-semibold text-[#8C9A84]">
            <Database className="w-3.5 h-3.5 text-[#8C9A84]" />
            <span>Data Centre • Synthetic Dataset Generator & Model Training Suite</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#2D3A31]">
            Data <span className="font-cursive text-5xl sm:text-6xl text-[#8C9A84]">Centre</span>
          </h2>
          <p className="text-sm text-[#2D3A31]/75 leading-relaxed">
            Generate high-entropy synthetic data for machine learning models and system processes, configure schemas, and train multi-algorithm AI models with live epoch convergence.
          </p>
        </div>

        {/* Sub-View Switcher Tabs */}
        <div className="flex items-center p-1 bg-[#F2F0EB] border border-[#E6E2DA] rounded-2xl gap-1 text-xs font-semibold">
          {[
            { id: "GENERATOR", label: "Dataset Generator", icon: Sparkles },
            { id: "MODEL_TRAINING", label: "Model Training Studio", icon: Cpu },
            { id: "CHAT_CORPUS", label: "Chat Corpus & Memory", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold",
                  isActive
                    ? "bg-[#2D3A31] text-[#FFFFFF] shadow-sm"
                    : "text-[#2D3A31]/70 hover:text-[#2D3A31]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#8C9A84]" : "text-[#8C9A84]/70")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          TAB 1: SYNTHETIC DATASET GENERATOR
         ======================================================== */}
      {activeTab === "GENERATOR" && (
        <div className="space-y-8 animate-in fade-in">
          {/* Generator Configuration Panel */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                  Multi-Domain Synthetic Data Synthesizer
                </span>
                <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
                  Configure & Generate Synthetic Datasets
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3.5 py-1.5 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-semibold text-[#2D3A31] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-1.5 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-semibold text-[#2D3A31] flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={handleGenerateData}
                  disabled={isGenerating}
                  className="botanical-btn-primary py-2 px-5 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing Records...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Generate New Dataset</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dynamic Custom Topic Synthesizer Bar */}
            <div className="p-5 bg-[#F9F8F4] border border-[#E6E2DA] rounded-[24px] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D3A31] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C9A84]" />
                  <span>Dynamic Custom Dataset Prompt (Unlimited Topics)</span>
                </span>
                <span className="text-[11px] text-[#8C9A84] font-mono">Any domain, e.g. Bike Models, EVs, Healthcare</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="text"
                  value={customTopicPrompt}
                  onChange={(e) => setCustomTopicPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateCustomTopic()}
                  placeholder="e.g. Generate dataset on bike models with five attributes, or EV specs with 6 features..."
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl px-4 py-2.5 text-xs text-[#2D3A31] placeholder:text-[#2D3A31]/50 focus:outline-none focus:border-[#8C9A84]"
                />
                <button
                  onClick={() => handleGenerateCustomTopic()}
                  disabled={isGeneratingCustom || !customTopicPrompt.trim()}
                  className="w-full sm:w-auto whitespace-nowrap botanical-btn-primary py-2.5 px-6 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
                >
                  {isGeneratingCustom ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Topic Dataset</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#2D3A31]/60 font-semibold uppercase">Presets:</span>
                {[
                  { label: "🏍️ Bike Models (5 Attributes)", p: "Generate dataset on bike models with 5 attributes (Brand, Engine CC, Top Speed, Mileage, Price)" },
                  { label: "🛒 E-Commerce Orders (6 Attributes)", p: "Generate dataset on e-commerce orders with 6 attributes (Items, Cart Value, Discount, Delivery Days, Loyalty, Payment)" },
                  { label: "🏥 Patient Clinical Metrics (5 Attributes)", p: "Generate dataset on clinical patients with 5 attributes (Age, Blood Pressure, Cholesterol, Glucose, BMI)" },
                  { label: "⚡ Electric Vehicles (6 Attributes)", p: "Generate dataset on electric vehicles with 6 attributes (Model, Battery KWh, Range KM, Charge Time, Horsepower, MSRP)" },
                  { label: "📈 Crypto Asset Telemetry (5 Attributes)", p: "Generate dataset on cryptocurrency assets with 5 attributes (Symbol, 24h Volume, RSI 14D, MACD Signal, Volatility)" },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomTopicPrompt(preset.p);
                      handleGenerateCustomTopic(preset.p);
                    }}
                    className="text-[11px] px-2.5 py-1 bg-[#FFFFFF] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-lg text-[#2D3A31] transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Domain Selector */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <label className="font-bold text-[#2D3A31] block">Target Domain / Task Type</label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as SyntheticDataDomain)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs font-semibold text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  {GENERATOR_DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
                <p className="text-[11px] text-[#2D3A31]/60">
                  {GENERATOR_DOMAINS.find((d) => d.id === selectedDomain)?.desc}
                </p>
              </div>

              {/* Sample Count Slider */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#2D3A31]">Sample Size</label>
                  <span className="font-mono font-bold text-[#8C9A84]">{sampleCount} Rows</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={sampleCount}
                  onChange={(e) => setSampleCount(+e.target.value)}
                  className="w-full accent-[#2D3A31]"
                />
                <div className="flex justify-between text-[10px] text-[#2D3A31]/50 font-mono">
                  <span>50</span>
                  <span>500</span>
                  <span>1000</span>
                </div>
              </div>

              {/* Distribution Strategy */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <label className="font-bold text-[#2D3A31] block">Mathematical Distribution</label>
                <select
                  value={distribution}
                  onChange={(e) => setDistribution(e.target.value as SyntheticDataDistribution)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs font-semibold text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  <option value="GAUSSIAN_MIXTURE">Gaussian Mixture Model</option>
                  <option value="UNIFORM">Uniform Feature Sampling</option>
                  <option value="MARKOVIAN_DRIFT">Markovian State Drift</option>
                  <option value="BETA_DISTRIBUTION">Beta Distribution (Skewed)</option>
                  <option value="POWER_LAW">Power Law (Heavy Tail)</option>
                </select>
                <p className="text-[11px] text-[#2D3A31]/60">Ensures realistic variance & bounds.</p>
              </div>

              {/* Noise Level */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#2D3A31]">Noise / Entropy Level</label>
                  <span className="font-mono font-bold text-[#C27B66]">{Math.round(noiseLevel * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.05"
                  value={noiseLevel}
                  onChange={(e) => setNoiseLevel(+e.target.value)}
                  className="w-full accent-[#C27B66]"
                />
                <div className="flex justify-between text-[10px] text-[#2D3A31]/50 font-mono">
                  <span>Deterministic (0%)</span>
                  <span>High Entropy (40%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset Metrics Telemetry */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-sm">
            <div className="space-y-1">
              <span className="text-xs text-[#8C9A84] font-medium block">Active Dataset Size</span>
              <span className="text-2xl font-serif font-bold text-[#2D3A31]">{generatedDataset.sampleCount} Records</span>
              <span className="text-[11px] text-[#2D3A31]/60 block">{generatedDataset.domain}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8C9A84] font-medium block">Engineered Features</span>
              <span className="text-2xl font-serif font-bold text-[#2D3A31]">{generatedDataset.featureCount} Features</span>
              <span className="text-[11px] text-[#2D3A31]/60 block">Target: {generatedDataset.targetName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8C9A84] font-medium block">Dataset Integrity</span>
              <span className="text-2xl font-serif font-bold text-[#8C9A84]">100% Clean</span>
              <span className="text-[11px] text-[#2D3A31]/60 block">0 Missing Values</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8C9A84] font-medium block">Entropy / Noise Index</span>
              <span className="text-2xl font-serif font-bold text-[#2D3A31]">{generatedDataset.metrics.meanEntropy}</span>
              <span className="text-[11px] text-[#2D3A31]/60 block">Information Density</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-[#8C9A84] font-medium block">Next Step</span>
              <button
                onClick={() => setActiveTab("MODEL_TRAINING")}
                className="mt-1 px-3 py-1 bg-[#2D3A31] hover:bg-[#8C9A84] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <span>Train Model on Data</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Interactive Generated Dataset Table */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                  Synthesized Sample Records
                </span>
                <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
                  Live Feature Matrix Preview ({generatedDataset.records.length} Rows)
                </h4>
              </div>
              <span className="text-xs font-mono text-[#8C9A84] px-3 py-1 bg-[#F9F8F4] border border-[#E6E2DA] rounded-full">
                Distribution: {generatedDataset.distribution}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E6E2DA] text-[#8C9A84] uppercase font-semibold text-[10px] tracking-wider bg-[#F9F8F4]/50">
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    {generatedDataset.featureNames.map((f, i) => (
                      <th key={i} className="py-2.5 px-3">{f}</th>
                    ))}
                    <th className="py-2.5 px-3 font-bold text-[#2D3A31]">{generatedDataset.targetName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F0EB]">
                  {generatedDataset.records.slice(0, 12).map((row) => (
                    <tr key={row.id} className="hover:bg-[#F9F8F4] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#2D3A31]">{row.id}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-[#2D3A31]/70">{row.timestamp}</td>
                      {generatedDataset.featureNames.map((f, i) => (
                        <td key={i} className="py-2.5 px-3 font-mono text-[#2D3A31]">
                          {typeof row.features[f] === "number" ? (+row.features[f]).toFixed(2) : row.features[f]}
                        </td>
                      ))}
                      <td className="py-2.5 px-3 font-semibold text-[#8C9A84] bg-[#8C9A84]/10 rounded-md">
                        {String(row.target)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {generatedDataset.records.length > 12 && (
                <div className="p-3 text-center text-xs text-[#8C9A84] font-medium bg-[#F9F8F4] rounded-b-xl border-t border-[#E6E2DA]">
                  Showing 12 of {generatedDataset.records.length} generated samples. Export full CSV/JSON to view all.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: LIVE MODEL TRAINING STUDIO
         ======================================================== */}
      {activeTab === "MODEL_TRAINING" && (
        <div className="space-y-8 animate-in fade-in">
          {/* Model Selection & Hyperparameter Controls */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                  Machine Learning Training Studio
                </span>
                <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
                  Train, Calibrate, and Validate ML Models
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartTraining}
                  disabled={isTraining}
                  className="botanical-btn-primary py-2.5 px-6 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm disabled:opacity-40"
                >
                  {isTraining ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Training Epoch {trainingEpochProgress}/{epochs}...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Start Model Training</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Model & Hyperparameter Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {/* Model Selector */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <label className="font-bold text-[#2D3A31] block">Algorithm Selection</label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs font-semibold text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  <option value="svm">Support Vector Machine (SVM)</option>
                  <option value="random_forest">Random Forest Classifier (Ensemble)</option>
                  <option value="knn">k-Nearest Neighbors (KNN)</option>
                  <option value="xgboost">XGBoost Gradient Boosting</option>
                  <option value="mlp">Deep MLP Neural Net (PyTorch)</option>
                  <option value="logistic">Logistic & Ridge Regression</option>
                  <option value="kmeans">K-Means Clustering</option>
                  <option value="naive_bayes">Gaussian Naive Bayes</option>
                  <option value="decision_tree">Decision Tree Classifier</option>
                  <option value="pca">PCA Dimensionality Reduction</option>
                </select>
                <p className="text-[11px] text-[#2D3A31]/60">Trained directly on active dataset.</p>
              </div>

              {/* Epochs Slider */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#2D3A31]">Training Epochs</label>
                  <span className="font-mono font-bold text-[#8C9A84]">{epochs} Iterations</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={epochs}
                  onChange={(e) => setEpochs(+e.target.value)}
                  className="w-full accent-[#2D3A31]"
                />
                <div className="flex justify-between text-[10px] text-[#2D3A31]/50 font-mono">
                  <span>10</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              {/* Learning Rate Slider */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#2D3A31]">Learning Rate (η)</label>
                  <span className="font-mono font-bold text-[#8C9A84]">{learningRate}</span>
                </div>
                <select
                  value={learningRate}
                  onChange={(e) => setLearningRate(+e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#E6E2DA] rounded-xl p-2 text-xs font-semibold text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                >
                  <option value={0.001}>0.001 (Conservative Adam)</option>
                  <option value={0.01}>0.01 (Standard)</option>
                  <option value={0.05}>0.05 (Fast Convergence)</option>
                  <option value={0.1}>0.1 (High Learning Rate)</option>
                </select>
                <p className="text-[11px] text-[#2D3A31]/60">Optimization step multiplier.</p>
              </div>

              {/* Train / Test Split */}
              <div className="p-4 bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#2D3A31]">Train/Test Split</label>
                  <span className="font-mono font-bold text-[#8C9A84]">{trainTestSplit}% / {100 - trainTestSplit}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="90"
                  step="5"
                  value={trainTestSplit}
                  onChange={(e) => setTrainTestSplit(+e.target.value)}
                  className="w-full accent-[#2D3A31]"
                />
                <div className="flex justify-between text-[10px] text-[#2D3A31]/50 font-mono">
                  <span>60/40</span>
                  <span>80/20</span>
                  <span>90/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress / Results Dashboard */}
          {isTraining && (
            <div className="p-6 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D3A31] flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#2D3A31] border-t-transparent rounded-full animate-spin" />
                  <span>Executing Epoch Gradient Steps ({trainingEpochProgress}/{epochs})</span>
                </span>
                <span className="font-mono text-xs font-bold text-[#8C9A84]">
                  {Math.round((trainingEpochProgress / epochs) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-[#E6E2DA] h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D3A31] rounded-full transition-all duration-75"
                  style={{ width: `${(trainingEpochProgress / epochs) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completed Training Performance Matrix */}
          {trainingRun && !isTraining && (
            <div className="space-y-6 animate-in fade-in">
              {/* Performance Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">Validation Accuracy</span>
                  <span className="text-2xl font-serif font-bold text-[#10B981]">{trainingRun.metrics.accuracy}%</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">Cross-validated</span>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">F1-Score</span>
                  <span className="text-2xl font-serif font-bold text-[#2D3A31]">{trainingRun.metrics.f1Score}</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">Harmonic mean</span>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">Precision</span>
                  <span className="text-2xl font-serif font-bold text-[#2D3A31]">{trainingRun.metrics.precision}</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">True positive rate</span>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">Recall</span>
                  <span className="text-2xl font-serif font-bold text-[#2D3A31]">{trainingRun.metrics.recall}</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">Sensitivity</span>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">ROC-AUC</span>
                  <span className="text-2xl font-serif font-bold text-[#8C9A84]">{trainingRun.metrics.rocAuc}</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">Discrimination score</span>
                </div>

                <div className="p-4 bg-[#FFFFFF] border border-[#E6E2DA] rounded-2xl space-y-1">
                  <span className="text-[11px] text-[#8C9A84] font-medium block">Inference Latency</span>
                  <span className="text-2xl font-serif font-bold text-[#2D3A31]">{trainingRun.metrics.p99LatencyMs}ms</span>
                  <span className="text-[10px] text-[#2D3A31]/60 block">Per vector inference</span>
                </div>
              </div>

              {/* Feature Importance & Deployment Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Feature Importance */}
                <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                    <span className="font-serif font-bold text-base text-[#2D3A31]">Feature Importance Weights</span>
                    <span className="text-xs text-[#8C9A84] font-mono">Gini Importance Index</span>
                  </div>

                  <div className="space-y-3">
                    {trainingRun.featureImportances.map((f, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between font-semibold text-[#2D3A31]">
                          <span>{f.name}</span>
                          <span className="font-mono text-[#8C9A84]">{f.importance}%</span>
                        </div>
                        <div className="w-full bg-[#E6E2DA] h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2D3A31] rounded-full"
                            style={{ width: `${f.importance * 2.5}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Deployment Card */}
                <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#8C9A84] uppercase tracking-wider block">
                      Model Artifact Registry
                    </span>
                    <h5 className="font-serif font-bold text-lg text-[#2D3A31]">{trainingRun.modelName}</h5>
                    <p className="text-xs text-[#2D3A31]/75 leading-relaxed">
                      Model weights trained and serialized. Ready to deploy to AI Gudown live decision swarms.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleDeployToGudown}
                      className="w-full botanical-btn-primary py-2.5 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
                    >
                      {deployedModelSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          <span>Deployed to AI Gudown!</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Deploy Model to AI Gudown</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onNavigateView("AI_GUDOWN")}
                      className="w-full py-2 px-4 bg-[#F9F8F4] hover:bg-[#F2F0EB] border border-[#E6E2DA] rounded-xl text-xs font-semibold text-[#2D3A31] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#8C9A84]" />
                      <span>Inspect in AI Gudown & SNS Charts</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Inference Playground */}
              <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[28px] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6E2DA] pb-3">
                  <span className="font-serif font-bold text-base text-[#2D3A31]">Live Model Inference Sandbox</span>
                  <span className="text-xs text-[#8C9A84] font-mono">Real-time vector inference</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Technical Rigor Index</span>
                      <span className="font-mono text-[#8C9A84]">{inferFeatureA}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={inferFeatureA}
                      onChange={(e) => setInferFeatureA(+e.target.value)}
                      className="w-full accent-[#2D3A31]"
                    />
                  </div>

                  <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>ACID & Constraint Affinity</span>
                      <span className="font-mono text-[#8C9A84]">{inferFeatureB}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      value={inferFeatureB}
                      onChange={(e) => setInferFeatureB(+e.target.value)}
                      className="w-full accent-[#2D3A31]"
                    />
                  </div>

                  <div className="p-3 bg-[#F9F8F4] border border-[#E6E2DA] rounded-xl space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Cosine Vector Match</span>
                      <span className="font-mono text-[#8C9A84]">{inferFeatureC}</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.0"
                      step="0.05"
                      value={inferFeatureC}
                      onChange={(e) => setInferFeatureC(+e.target.value)}
                      className="w-full accent-[#2D3A31]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    onClick={handleRunInference}
                    className="botanical-btn-primary py-2 px-5 text-xs font-semibold rounded-xl flex items-center gap-2"
                  >
                    <Target className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Run Instant Inference Prediction</span>
                  </button>

                  {instantPrediction && (
                    <div className="flex items-center gap-3 text-xs bg-[#F9F8F4] p-2.5 rounded-xl border border-[#E6E2DA]">
                      <span className="text-[#8C9A84] font-bold">Predicted:</span>
                      <span className="font-bold text-[#2D3A31]">{instantPrediction.choice}</span>
                      <span className="px-2 py-0.5 bg-[#8C9A84]/15 rounded-full font-mono text-[10px] font-bold text-[#2D3A31]">
                        {instantPrediction.probA}% Confidence
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAB 3: INGESTED CHAT CORPUS & MEMORY DATASETS
         ======================================================== */}
      {activeTab === "CHAT_CORPUS" && (
        <div className="space-y-8 animate-in fade-in">
          {/* Chat Corpus Table */}
          <div className="bg-[#FFFFFF] border border-[#E6E2DA] rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6E2DA] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#8C9A84] uppercase tracking-wider block mb-1">
                  Training Corpus Dataset Records
                </span>
                <h4 className="font-serif font-bold text-xl text-[#2D3A31]">
                  Chat Samples Matrix ({filteredSamples.length} Active Records)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsFeedingModels(true);
                    setFeedSuccess(false);
                    setTimeout(() => {
                      veronicaStore.ingestChatToGudown(samples);
                      setIsFeedingModels(false);
                      setFeedSuccess(true);
                      setTimeout(() => setFeedSuccess(false), 3000);
                    }, 1000);
                  }}
                  disabled={isFeedingModels}
                  className="botanical-btn-primary py-2 px-5 text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  {isFeedingModels ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Vectorizing...</span>
                    </>
                  ) : feedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Fed to 10 Models!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>Feed Chat Corpus to AI Gudown</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D3A31]/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chat training text, category, or tokens..."
                  className="w-full bg-[#F9F8F4] border border-[#E6E2DA] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2D3A31] focus:outline-none focus:border-[#8C9A84]"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto">
                {["ALL", "Architectural Dilemma", "Constitutional Preference", "Systems Engineering", "RAG Ingestion"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                      categoryFilter === cat
                        ? "bg-[#2D3A31] text-[#FFFFFF] border-[#2D3A31]"
                        : "bg-[#FFFFFF] text-[#2D3A31]/70 border-[#E6E2DA] hover:bg-[#F2F0EB]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dataset Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E6E2DA] text-[#8C9A84] uppercase font-semibold text-[10px] tracking-wider bg-[#F9F8F4]/50">
                    <th className="py-2.5 px-3">Sample ID</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Text Excerpt</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Technical Rigor</th>
                    <th className="py-2.5 px-3">Tokens</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F0EB]">
                  {filteredSamples.map((sample) => (
                    <tr key={sample.id} className="hover:bg-[#F9F8F4] transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#2D3A31]">{sample.id}</td>
                      <td className="py-2.5 px-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase", sample.role === "user" ? "bg-[#2D3A31] text-[#FFFFFF]" : "bg-[#8C9A84]/15 text-[#8C9A84]")}>
                          {sample.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-sm truncate text-[#2D3A31]/80">
                        {sample.text}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#2D3A31]">
                        {sample.category}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#8C9A84]">
                        {sample.technicalRigor}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#2D3A31]/70">
                        {sample.tokenCount}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-[#8C9A84]/15 text-[#8C9A84] rounded-full text-[10px] font-bold">
                          {sample.ingestedStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
