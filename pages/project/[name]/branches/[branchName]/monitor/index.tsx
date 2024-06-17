import { useState, useEffect } from "react";
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../../../../components/bootstrap/Card";
import Page from "../../../../../../layout/Page/Page";
import { CartesianGrid, XAxis, YAxis, Tooltip, Area, AreaChart } from "recharts";
import { useProjectContext } from "../../../../../../context/projectContext";

type GraphDataType = {
  timestamp?: number;
  cpu_usage: number;
  memory_usage: number;
  storage_usage: number;
};

const Index = () => {
  const [graphData, setGraphData] = useState<GraphDataType[]>([]);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const { monitorUrl } = useProjectContext();

  useEffect(() => {
    const handleWebSocket = () => {
      const socket = new WebSocket(`${monitorUrl}`);

      socket.onopen = () => {
        setIsWebSocketConnected(true);
      };

      socket.onmessage = (event) => {
        const correctedJson = event.data.replace(/'/g, '"');

        try {
          const data = JSON.parse(correctedJson);
          const now = new Date();
          const formattedTimestamp = `${now.getMinutes().toString().padStart(2, "0")}:${now
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;
          const dataWithTimestamp = {
            ...data,
            timestamp: formattedTimestamp,
          };

          setGraphData((prev) => [...prev, dataWithTimestamp]);
        } catch (e) {
          console.error("Error parsing JSON!", e);
        }
      };

      socket.onclose = () => {
        setIsWebSocketConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        socket.close();
      };
    };
    handleWebSocket();
  }, []);

  if (!monitorUrl || monitorUrl === "") {
    return <p>Url not found</p>;
  }

  return (
    <Page>
      <Card shadow="sm" className="mb-3 h-auto">
        <CardHeader>
          <CardLabel>
            <CardTitle>Memory Usage</CardTitle>
            <CardSubTitle>(in seconds)</CardSubTitle>
          </CardLabel>
        </CardHeader>
        <CardBody className="d-flex justify-content-center align-items-center">
          <AreaChart
            width={860}
            height={300}
            data={graphData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="memory_usage"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorMemory)"
            />
          </AreaChart>
        </CardBody>
      </Card>

      <Card shadow="sm" className="mb-3 h-auto">
        <CardHeader>
          <CardLabel>
            <CardTitle>CPU usage</CardTitle>
            <CardSubTitle>(in seconds)</CardSubTitle>
          </CardLabel>
        </CardHeader>
        <CardBody className="d-flex justify-content-center align-items-center">
          <AreaChart
            width={860}
            height={300}
            data={graphData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="cpu_usage"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorCpu)"
            />
          </AreaChart>
        </CardBody>
      </Card>

      <Card shadow="sm" className="mb-3 h-auto">
        <CardHeader>
          <CardLabel>
            <CardTitle>Storage Usage</CardTitle>
            <CardSubTitle>(in seconds)</CardSubTitle>
          </CardLabel>
        </CardHeader>
        <CardBody className="d-flex justify-content-center align-items-center">
          <AreaChart
            width={860}
            height={300}
            data={graphData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f4b501" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f4b501" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="storage_usage"
              stroke="#f4b501"
              fillOpacity={1}
              fill="url(#colorStorage)"
            />
          </AreaChart>
        </CardBody>
      </Card>
    </Page>
  );
};

export default Index;
