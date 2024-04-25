export interface HiddenLocationEncounterMongo {
    id: string,
    name: string,
    description: string,
    xpPoints: number,
    status: string,
    type: string,
    latitude: number,
    longitude: number,
    encounterId: string,
    imageURL: string,
    imageLatitude: number,
    imageLongitude: number,
    distanceTreshold: number,
    shouldBeApproved: boolean
}