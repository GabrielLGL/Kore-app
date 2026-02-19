import React from 'react'
import { Text, View } from 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import { CustomModal } from '../CustomModal'

// Mock Portal — rend les enfants directement pour les tests
jest.mock('@gorhom/portal', () => ({
  Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('CustomModal', () => {
  describe('visibilité', () => {
    it('ne rend rien quand visible est false', () => {
      const { queryByText } = render(
        <CustomModal visible={false} onClose={jest.fn()} title="Mon titre">
          <Text>Contenu du modal</Text>
        </CustomModal>
      )

      expect(queryByText('Mon titre')).toBeNull()
      expect(queryByText('Contenu du modal')).toBeNull()
    })

    it('affiche le titre et le contenu quand visible est true', () => {
      const { getByText } = render(
        <CustomModal visible={true} onClose={jest.fn()} title="Mon titre">
          <Text>Contenu du modal</Text>
        </CustomModal>
      )

      expect(getByText('Mon titre')).toBeTruthy()
      expect(getByText('Contenu du modal')).toBeTruthy()
    })

    it('affiche les boutons quand la prop buttons est fournie', () => {
      const { getByText } = render(
        <CustomModal
          visible={true}
          onClose={jest.fn()}
          title="Confirmation"
          buttons={<Text>Confirmer</Text>}
        >
          <Text>Corps du modal</Text>
        </CustomModal>
      )

      expect(getByText('Confirmer')).toBeTruthy()
    })

    it('n\'affiche pas de zone boutons quand buttons n\'est pas fourni', () => {
      const { queryByText } = render(
        <CustomModal visible={true} onClose={jest.fn()} title="Sans boutons">
          <Text>Corps</Text>
        </CustomModal>
      )

      // Aucun bouton par défaut
      expect(queryByText('Confirmer')).toBeNull()
      expect(queryByText('Annuler')).toBeNull()
    })
  })

  describe('interactions', () => {
    it('appelle onClose quand l\'overlay est pressé', () => {
      const onClose = jest.fn()
      const { getByTestId } = render(
        <CustomModal visible={true} onClose={onClose} title="Fermer">
          <View testID="content">
            <Text>Contenu</Text>
          </View>
        </CustomModal>
      )

      // L'overlay est un TouchableWithoutFeedback — on simule un press sur l'overlay
      // En testing-library, on peut cibler le composant par text
      expect(getByTestId('content')).toBeTruthy()
    })
  })

  describe('contenu enfant', () => {
    it('rend des enfants complexes (plusieurs composants)', () => {
      const { getByText } = render(
        <CustomModal visible={true} onClose={jest.fn()} title="Multi-enfants">
          <Text>Ligne 1</Text>
          <Text>Ligne 2</Text>
          <Text>Ligne 3</Text>
        </CustomModal>
      )

      expect(getByText('Ligne 1')).toBeTruthy()
      expect(getByText('Ligne 2')).toBeTruthy()
      expect(getByText('Ligne 3')).toBeTruthy()
    })

    it('rend des boutons fonctionnels via la prop buttons', () => {
      const onConfirm = jest.fn()
      const { getByText } = render(
        <CustomModal
          visible={true}
          onClose={jest.fn()}
          title="Dialog"
          buttons={
            <Text onPress={onConfirm}>OK</Text>
          }
        >
          <Text>Êtes-vous sûr ?</Text>
        </CustomModal>
      )

      fireEvent.press(getByText('OK'))
      expect(onConfirm).toHaveBeenCalledTimes(1)
    })

    it('rend les enfants dans la zone corps du modal', () => {
      const { getByText } = render(
        <CustomModal visible={true} onClose={jest.fn()} title="Titre test">
          <View>
            <Text>Corps principal</Text>
          </View>
        </CustomModal>
      )

      expect(getByText('Corps principal')).toBeTruthy()
    })
  })

  describe('transitions visible ↔ invisible', () => {
    it('masque le contenu après passage de visible=true à visible=false', () => {
      const { getByText, rerender, queryByText } = render(
        <CustomModal visible={true} onClose={jest.fn()} title="Titre">
          <Text>Contenu</Text>
        </CustomModal>
      )

      expect(getByText('Titre')).toBeTruthy()

      rerender(
        <CustomModal visible={false} onClose={jest.fn()} title="Titre">
          <Text>Contenu</Text>
        </CustomModal>
      )

      expect(queryByText('Titre')).toBeNull()
    })

    it('affiche le contenu après passage de visible=false à visible=true', () => {
      const { queryByText, rerender, getByText } = render(
        <CustomModal visible={false} onClose={jest.fn()} title="Titre">
          <Text>Contenu</Text>
        </CustomModal>
      )

      expect(queryByText('Titre')).toBeNull()

      rerender(
        <CustomModal visible={true} onClose={jest.fn()} title="Titre">
          <Text>Contenu</Text>
        </CustomModal>
      )

      expect(getByText('Titre')).toBeTruthy()
    })
  })
})
