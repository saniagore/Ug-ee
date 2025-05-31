import { View, Text } from "react-native";
import { useViajesConductor } from "./utils/viajes";
import { useConductorId } from "./utils/useConductorId";

export default function HomeContent({route}) {
  const { celular } = route.params || {};
  const { conductorId } = useConductorId(celular);
  const { viajes, loading, error, refetch } = useViajesConductor(conductorId);

  console.log(conductorId);
  console.log(viajes);
  
  return (
    <View>
        <Text>
            hola
        </Text>
    </View>
  );
}
