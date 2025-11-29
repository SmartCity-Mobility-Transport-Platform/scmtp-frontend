export const GET_ROUTES = `
  query GetRoutes {
    routes {
      id
      name
      stops {
        id
        name
        latitude
        longitude
      }
      schedules {
        id
        departureTime
        arrivalTime
        daysOfWeek
      }
    }
  }
`;

export const GET_ROUTE = `
  query GetRoute($id: ID!) {
    route(id: $id) {
      id
      name
      stops {
        id
        name
        latitude
        longitude
      }
      schedules {
        id
        departureTime
        arrivalTime
        daysOfWeek
      }
    }
  }
`;

export const GET_STOPS_BY_LOCATION = `
  query GetStopsByLocation($lat: Float!, $lng: Float!, $radiusKm: Float!) {
    stopsByLocation(lat: $lat, lng: $lng, radiusKm: $radiusKm) {
      id
      name
      latitude
      longitude
    }
  }
`;

export const GET_NEXT_DEPARTURES = `
  query GetNextDepartures($stopId: ID!, $fromTime: String!) {
    nextDepartures(stopId: $stopId, fromTime: $fromTime) {
      id
      routeId
      departureTime
      arrivalTime
      daysOfWeek
    }
  }
`;

